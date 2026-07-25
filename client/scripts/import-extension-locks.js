const fs = require('fs')
const childProcess = require('child_process')
const path = require('path')

const clientRoot = path.resolve(__dirname, '..')
const repoRoot = path.resolve(clientRoot, '..')
const repoNpmrc = path.join(repoRoot, '.npmrc')
const clientNpmrc = path.join(clientRoot, '.npmrc')

function importExtensionLocks (clientFolder = clientRoot) {
  const extensionRepos = getExtensionRepos(clientFolder)

  if (extensionRepos.length === 0) {
    console.log('extension repos not present, skip importing extension locks')
    return []
  }

  const importedFolders = []

  for (const extensionRepo of extensionRepos) {
    const packageLockFolders = getPackageLockFolders(extensionRepo)
    for (const packageLockFolder of packageLockFolders) {
      outputImportLog(packageLockFolder)
      pnpmImport(packageLockFolder)
      importedFolders.push(packageLockFolder)
    }
  }

  if (importedFolders.length === 0) {
    console.log('extension package-lock.json files not present, skip importing extension locks')
  }

  return importedFolders
}

function getExtensionRepos (clientFolder = clientRoot) {
  const extensionRepos = []
  const clientExtensionsRepo = path.join(clientFolder, 'extensions')

  addExtensionRepo(extensionRepos, clientExtensionsRepo)

  if (fs.existsSync(clientFolder)) {
    for (const subfolder of getDirectSubfolders(clientFolder)) {
      addExtensionRepo(extensionRepos, subfolder)
    }
  }

  return extensionRepos
}

function addExtensionRepo (extensionRepos, folder) {
  if (!isExtensionRepo(folder)) {
    return
  }

  if (!extensionRepos.includes(folder)) {
    extensionRepos.push(folder)
  }
}

function getPackageLockFolders (extensionRepo) {
  const folders = []

  const widgetsFolder = path.join(extensionRepo, 'widgets')
  if (fs.existsSync(widgetsFolder)) {
    const widgetSubFolders = getAllSubfolders(widgetsFolder)
    for (const widgetDir of widgetSubFolders) {
      if (hasPackageJson(widgetDir) && hasPackageLock(widgetDir)) {
        folders.push(widgetDir)
      }
    }
  }

  return folders
}

function getDirectSubfolders (folder) {
  if (!fs.existsSync(folder)) {
    return []
  }

  return fs.readdirSync(folder)
    .filter(subfolder => subfolder !== 'node_modules' && subfolder[0] !== '.')
    .map(subfolder => path.join(folder, subfolder))
    .filter(subfolder => fs.statSync(subfolder).isDirectory())
}

function getAllSubfolders (folder) {
  const directSubfolders = getDirectSubfolders(folder)
  const nestedSubfolders = directSubfolders.map(directSubfolder => getAllSubfolders(directSubfolder)).flat(1)
  return [...directSubfolders, ...nestedSubfolders]
}

function isExtensionRepo (folder) {
  const manifestPath = path.join(folder, 'manifest.json')
  if (!fs.existsSync(manifestPath)) {
    return false
  }

  const manifestJson = JSON.parse(fs.readFileSync(manifestPath))
  return manifestJson.type === 'exb-web-extension-repo'
}

function hasPackageJson (folder) {
  return fs.existsSync(path.join(folder, 'package.json'))
}

function hasPackageLock (folder) {
  return fs.existsSync(path.join(folder, 'package-lock.json'))
}

function outputImportLog (folder) {
  console.log('=========================================================')
  console.log(`Importing package-lock.json in ${folder}`)
  console.log('=========================================================')
}

function pnpmImport (where) {
  childProcess.execFileSync('pnpm', ['import', '--ignore-workspace'], {
    cwd: where,
    env: {
      ...getPnpmEnv(where),
      NPM_CONFIG_FROZEN_LOCKFILE: 'false',
      npm_config_frozen_lockfile: 'false'
    },
    stdio: 'inherit',
    shell: process.platform === 'win32'
  })
}

function getPnpmEnv (where = clientRoot) {
  const npmrc = findNearestNpmrc(where) || [repoNpmrc, clientNpmrc].find(npmrcPath => fs.existsSync(npmrcPath))
  const baseEnv = {
    ...process.env,
    NPM_CONFIG_CONFIRM_MODULES_PURGE: 'false',
    npm_config_confirm_modules_purge: 'false'
  }

  if (npmrc) {
    const npmrcConfig = getNpmrcConfig(npmrc)
    return {
      ...baseEnv,
      NPM_CONFIG_USERCONFIG: npmrc,
      ...npmrcConfig
    }
  }

  return baseEnv
}

function findNearestNpmrc (where) {
  let current = path.resolve(where)

  while (isSameOrChildPath(current, clientRoot)) {
    const npmrc = path.join(current, '.npmrc')
    if (fs.existsSync(npmrc)) {
      return npmrc
    }

    const parent = path.dirname(current)
    if (parent === current) {
      break
    }
    current = parent
  }

  return null
}

function isSameOrChildPath (folder, parent) {
  const relative = path.relative(parent, folder)
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative))
}

function getNpmrcConfig (npmrc) {
  const config = {}
  const npmrcContent = fs.readFileSync(npmrc, 'utf8')

  for (const line of npmrcContent.split(/\r?\n/)) {
    const trimmedLine = line.trim()
    if (!trimmedLine || trimmedLine.startsWith('#') || trimmedLine.startsWith(';')) {
      continue
    }

    const separatorIndex = trimmedLine.indexOf('=')
    if (separatorIndex === -1) {
      continue
    }

    const key = trimmedLine.slice(0, separatorIndex).trim()
    const value = trimmedLine.slice(separatorIndex + 1).trim()
    if (key === 'registry' && value) {
      config.NPM_CONFIG_REGISTRY = value
      config.npm_config_registry = value
    }
  }

  return config
}

if (require.main === module) {
  importExtensionLocks()
}

module.exports = {
  getAllSubfolders,
  getDirectSubfolders,
  getExtensionRepos,
  getPackageLockFolders,
  getPnpmEnv,
  importExtensionLocks,
  isExtensionRepo
}
