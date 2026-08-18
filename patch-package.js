const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.scripts.postinstall = "sed -i 's/global.fetch = function/var __dummy_fetch = function/' node_modules/formdata-polyfill/FormData.js || true";
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
