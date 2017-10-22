eval "$(ssh-agent -s)" &&
ssh-add ~/.ssh/kjosturett &&
cd /root/kjosturett
git pull origin master &&
npm install &&
node node_modules/node-sass/scripts/install.js &&
npm rebuild node-sass &&
npm run build-data &&
npm run build -- --release &&
pm2 restart kjosturett
