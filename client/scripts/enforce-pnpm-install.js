const path = require('path')

const REQUIRED_PNPM_VERSION = '11.9.0'
const npmExecPath = process.env.npm_execpath ?? ''
const userAgent = process.env.npm_config_user_agent ?? ''
const RED = '\x1b[31m'
const RESET = '\x1b[0m'

const isPnpmByExecPath = /pnpm/i.test(path.basename(npmExecPath))
const isPnpmByUserAgent = userAgent.startsWith('pnpm/')
const pnpmVersionMatch = userAgent.match(/^pnpm\/([^\s]+)/)
const detectedPnpmVersion = pnpmVersionMatch?.[1]
const detectedPackageManager = userAgent.split('/')[0] || path.basename(npmExecPath) || 'unknown'

if ((isPnpmByExecPath || isPnpmByUserAgent) && detectedPnpmVersion === REQUIRED_PNPM_VERSION) {
  process.exit(0)
}

const lines = buildErrorLines()

const width = Math.max(...lines.map(line => line.length)) + 4
const border = '='.repeat(width)

console.error(`\n${RED}${border}${RESET}`)
for (const line of lines) {
  console.error(`${RED}|${RESET} ${line.padEnd(width - 4)} ${RED}|${RESET}`)
}
console.error(`${RED}${border}${RESET}\n`)

process.exit(1)

function buildErrorLines () {
  if (isPnpmByExecPath || isPnpmByUserAgent) {
    return [
      `Only pnpm@${REQUIRED_PNPM_VERSION} is supported in this repository.`,
      '',
      `Detected pnpm version: ${detectedPnpmVersion ?? 'unknown'}`,
      `Switch to pnpm@${REQUIRED_PNPM_VERSION}:`,
      `  corepack use pnpm@${REQUIRED_PNPM_VERSION}`,
      'After switching pnpm versions, run:',
      '  pnpm ci'
    ]
  }

  return [
    'Dependency installation via npm/yarn/bun is disabled in this repository.',
    '',
    `Detected package manager: ${detectedPackageManager}`,
    `Required package manager: pnpm@${REQUIRED_PNPM_VERSION}`,
    `Install pnpm@${REQUIRED_PNPM_VERSION} globally:`,
    `  npm i -g pnpm@${REQUIRED_PNPM_VERSION}`,
    'After installing pnpm globally, run:',
    '  pnpm ci'
  ]
}
