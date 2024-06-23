const { execSync } = require('child_process');
const fs = require('fs');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const version = packageJson.version;
const commands = [
  `electron-packager . Nota-${version} --platform=linux --arch=x64 --icon=assets/nota-9.png`,
  `electron-packager . Nota-${version} --platform=win32 --arch=x64 --icon=assets/nota-9.ico`
];
commands.forEach(cmd => {
  console.log(`Running: ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
});
