#!/bin/sh
sudo apt-get update && sudo UCF_FORCE_CONFFNEW=1 apt-get install -y openssh-server git gnupg 
sudo sed -i 's/^#\?Port [0-9]*/Port 8022/' /etc/ssh/sshd_config
sudo systemctl restart ssh
cat /mnt/shared/Download/at_id_ed25519.pub >> ~/.ssh/authorized_keys

curl -LsSf https://astral.sh/uv/install.sh | sh
uv python install 3.12

tar -xzvf /mnt/shared/Download/instaloader.tar.gz

networkctl status
exit
