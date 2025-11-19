const { execSync } = require('child_process');
const fs = require('fs');

const incrementType = process.argv[2]; // major, minor, patch
const branch = process.argv[3];

const newVersion = getNewVersion();

updatePackageJson(newVersion);
createReleaseTag(newVersion);

function getNewVersion() {
  // Get sorted tags (last tag will be the first element)
  const tags = execSync('git fetch --tags && git tag --sort=-v:refname')
    .toString()
    .trim()
    .split('\n');
  const lastTag = tags.length > 0 ? tags[0] : '0.0.0';

  const [major, minor, patch] = lastTag.split('.').map(Number);
  switch (incrementType) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
  }
}

function updatePackageJson(version) {
  const packageJsonFile = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  packageJsonFile.version = version;
  fs.writeFileSync('package.json', JSON.stringify(packageJsonFile, null, 2) + '\n', 'utf8');

  // Update package-lock
  execSync('npm install');

  // Commit changes
  execSync('git config user.name "github-actions[bot]"');
  execSync('git config user.email "github-actions[bot]@users.noreply.github.com"');
  execSync('git add package.json package-lock.json');
  execSync(`git commit -m "chore: release ${version}"`);
  execSync(`git push origin HEAD:${branch}`);
}

function createReleaseTag(version) {
  execSync(`git tag -a ${version} -m "Release ${version}"`);
  execSync(`git push origin ${version}`);
}
