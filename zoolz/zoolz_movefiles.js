// zoolz
// selezionare i files da copiare sul sito e specificare la cartella di destinazione ad es. Temp/brcc/ con / finale

var filesToBeMoved = [];
for (var i = 0, l = _selectedArray.length; i < l; i++) {
	filesToBeMoved.push(_filesViewedCache[_selectedArray[i]]);
}
moveFiles(filesToBeMoved, "Temp/ar/video/video35/");
