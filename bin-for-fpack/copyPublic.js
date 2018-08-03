const fs = require('fs-extra');
const path = require('path');

function changeHtml(filePath, bundleReanme, bundleEndName) {
  let data = fs.readFileSync(filePath, { encoding: 'utf-8' });
  const exp = eval(`/${bundleReanme}/g`);
  data = data.replace(exp, bundleEndName);
  data = data.replace(/<!--\[/g, '');
  data = data.replace(/\]-->/g, '');
  setTimeout(() => {
    fs.removeSync(filePath);
    fs.createFileSync(filePath);
    fs.writeFileSync(filePath, data);
  }, 30);
}

module.exports = function({
  publicDirPath,
  outDir,
  bundleReanme,
  bundleEndName,
  htmlFile,
}) {
  const htmlPath = path.resolve(outDir, htmlFile);
  fs.copySync(publicDirPath, outDir);
  changeHtml(htmlPath, bundleReanme, bundleEndName);
};
