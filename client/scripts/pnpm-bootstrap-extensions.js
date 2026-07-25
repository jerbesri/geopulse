const fs = require('fs')
const childProcess = require('child_process')
const path = require('path')
const { getAllSubfolders, getExtensionRepos, getPnpmEnv, importExtensionLocks, isExtensionRepo } = require('./import-extension-locks')

const clientRoot = path.resolve(__dirname, '..')
const extensionRepos = getExtensionRepos(clientRoot)

if (extensionRepos.length === 0) {
  console.log('extension repos not present, skip')
  process.exit(0)
}

importExtensionLocks(clientRoot)

for (const extensionRepo of extensionRepos) {
  if (!isExtensionRepo(extensionRepo)) {
    continue
  }

  if (hasPackageJson(extensionRepo) && hasLockfile(extensionRepo)) {
    outputPathLog(extensionRepo)
    pnpmCi(extensionRepo)
  }

  const widgetsFolder = path.join(extensionRepo, 'widgets')
  if (fs.existsSync(widgetsFolder)) {
    const widgetSubFolders = getAllSubfolders(widgetsFolder)
    for (const widgetDir of widgetSubFolders) {
      if (!hasPackageJson(widgetDir)) {
        continue
      }

      if (hasLocalLockfile(widgetDir)) {
        outputPathLog(widgetDir)
        pnpmCi(widgetDir, { ignoreWorkspace: true })
      }
    }
  }
}

function hasPackageJson (folder) {
  return fs.existsSync(path.join(folder, 'package.json'))
}

function hasLockfile (folder) {
  return fs.existsSync(path.join(folder, 'pnpm-lock.yaml')) || fs.existsSync(path.join(folder, 'package-lock.json'))
}

function hasLocalLockfile (folder) {
  return hasLockfile(folder)
}

function outputPathLog (folder) {
  console.log('=========================================================')
  console.log(`Installing dependencies in ${folder}`)
  console.log('=========================================================')
}

function pnpmCi (where, options = {}) {
  const installArgs = [
    'ci',
    '--config.confirmModulesPurge=false',
    '--config.minimumReleaseAge=0',
    '--ignore-scripts'
  ]

  if (options.ignoreWorkspace) {
    installArgs.push('--ignore-workspace')
  }

  childProcess.execFileSync('pnpm', installArgs, {
    cwd: where,
    env: getPnpmEnv(where),
    stdio: 'inherit',
    shell: process.platform === 'win32'
  })
}
