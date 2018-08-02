// { publicDirPath, outDir, bundleName, htmlFile }
const fs = require('fs-extra');
const path = require('path');

function changeHtml(filePath, bundleName, bundleReanme) {
  let data = fse.readFileSync(filePath, { encoding: 'utf-8' });
  if (config && config.html && config.html.length > 0) {
    for (let i = 0, l = config.html.length; i <= l; i++) {
      const exp = eval(`/${bundleName}/g`);
      data = data.replace(exp, bundleReanme);
    }
  }
  data = data.replace(/<!--\[/g, '');
  data = data.replace(/\]-->/g, '');
  setTimeout(() => {
    fse.removeSync(filePath);
    fse.createFileSync(filePath);
    fse.writeFileSync(filePath, data);
  }, config.timeout || 30);
}

module.exports = function({
  publicDirPath,
  outDir,
  bundleName,
  bundleReanme,
  htmlFile,
}) {
  const htmlPath = path.resolve(outDir, htmlFile);
  fs.copy(publicDirPath, outDir).then(() => {
    changeHtml(htmlPath, bundleName, bundleReanme);
  });
};
