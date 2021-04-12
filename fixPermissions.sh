chmod +x fixPermissions.sh
sudo find . -type f -exec chmod 664 -- {} +
sudo find . -type d -exec chmod 775 {} +
sudo find ./node_modules -type f -exec chmod 644 -- {} +
sudo find ./node_modules -type d -exec chmod 755 {} +
sudo chmod 777 -R .git