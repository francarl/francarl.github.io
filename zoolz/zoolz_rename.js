function showRenameDialog() {
    if (checkIfHasShowFilesPrivilege(2) && _selectedArray.length == 1) {        
        CloseMM();
        ResetDialog();
        document.getElementById("fancyHeader").innerHTML = GetResource(392);
        document.getElementById("fancyBodyTitle").innerHTML = GetResource(393);
        document.getElementById('actionButton').value = GetResource(392);
        document.getElementById('txtInput').value = "";
        document.getElementById('txtInput').style.display = "";
        //document.getElementById('actionButton').disabled = "disabled";
        document.getElementById('actionButton').onclick = function (e) {
            renameFile2(_filesViewedCache[_selectedArray[0]], document.getElementById('txtInput').value);
        };
        document.getElementById("txtBtn").style.display = "";

        var fileName;
        if (_filesViewedCache[_selectedArray[0]].Flag & 1 == 0)
            fileName = Path.getFileNameWithoutExtension(_filesViewedCache[_selectedArray[0]].Name);
        else
            fileName = _filesViewedCache[_selectedArray[0]].Name;

        $("#txtInput").off('keyup').keyup(function (event) {
            if (event.keyCode == 13) {

                stopPropagation(event);

                $("#actionButton").click();
            }

            if (this.value != "")
                document.getElementById('actionButton').disabled = "";
            else
                document.getElementById('actionButton').disabled = "disabled";

        }).val(fileName).focus().select();

        $("#linkMainFancy").trigger('click');
        $("#txtInput").focus();
    }
}


function renameFile2(file, newName) {
    if (Path.isValidFileName(newName)) {
        $.fancybox.close();
        if (Path.getFileNameWithoutExtension(file.Name) != newName) {
            ShowMainLoader();

            var xhrObj = new getXMLHttpRequest();

            xhrObj.onreadystatechange = function () {
                if (xhrObj.readyState == 4) {
                    if (xhrObj.status == 200) {
                        if (xhrObj.getResponseHeader("ErrorCode") == "2025") // IOException = 2025
                        {
                            ShowMessage(xhrObj.getResponseHeader("ErrorMessage"), GetResource(210));
                        }
                        else
                        {
                            if (xhrObj.getResponseHeader("EC") == "0") {
                                //if ((file.Flag & 1) == 1) {
                                //    ShowMessage(GetResource(394), GetResource(392));
                                //}
                                //else {
                                //Refresh();
                                //}
                            }
                            else {
                                HandleProblem(xhrObj);
                            }
                        }
                        
                        HideMainLoader();
                    }
                }
            }

            xhrObj.open("POST", _serverHandler, true);
            xhrObj.setRequestHeader("ACTION", "Rename");
            xhrObj.setRequestHeader("IsView", _isView);
            xhrObj.setRequestHeader("UserID", userID);

            var postData = {
                newFileName: newName,
                parentPath: _currentPath,
                fileInfo: JSON.stringify(file)
            };

            SendXHR(xhrObj, postData);
        }
    }
    else {
        $('#pFancyMSG').html('<span style="color:#FF0000">' + GetResource(337) + '</span>');
    }
}