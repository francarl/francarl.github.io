#!/bin/sh
apt update && apt install -y openssh-server git gnupg 
sed -i 's/^#\?Port [0-9]*/Port 8022/' /etc/ssh/sshd_config
systemctl restart ssh
sudo -u droid cat /mnt/shared/Download/id_ed25519.pub >> ~/.ssh/authorized_keys 
networkctl status
