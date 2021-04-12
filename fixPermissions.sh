find . -type f -exec chmod 664 -- {} +
find . -type d -exec chmod 775 {} +
find node_modules/ -type f -exec chmod 644 -- {} +
find node_modules/ -type d -exec chmod 755 {} +
chmod node_modules 755