#!/bin/sh
sudo apt update && sudo apt install -y openssh-server git gnupg 
sudo sed -i 's/^#\?Port [0-9]*/Port 8022/' /etc/ssh/sshd_config
sudo systemctl restart ssh
cat /mnt/shared/Download/id_ed25519.pub >> ~/.ssh/authorized_keys 
networkctl status
exit
