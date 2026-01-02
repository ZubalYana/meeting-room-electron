import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { app, BrowserWindow, Tray, Menu, nativeImage } from 'electron'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null
let tray: Tray | null = null
let isQuiting = false

const DIST_PATH = path.join(__dirname, '../dist')
const PUBLIC_PATH = path.join(__dirname, '../public')
const ICON_NAME = 'logo.png'

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 700,
    icon: path.join(PUBLIC_PATH, ICON_NAME),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  win.on('close', (e) => {
    if (!isQuiting) {
      e.preventDefault()
      win?.hide()
    }
  })

  if (process.env.FARM_DEV_SERVER_URL) {
    win.loadURL(process.env.FARM_DEV_SERVER_URL)
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(DIST_PATH, 'index.html'))
  }

  createTray()
}

function createTray() {
  if (tray) return

  const iconPath = path.join(PUBLIC_PATH, ICON_NAME)
  let nativeImg = nativeImage.createFromPath(iconPath)
  nativeImg = nativeImg.resize({ width: 16, height: 16 })

  tray = new Tray(nativeImg)
  tray.setToolTip('Farm App')

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show',
      click: () => { win?.show(); win?.focus() },
    },
    {
      label: 'Hide',
      click: () => win?.hide(),
    },
    {
      type: 'separator',
    },
    {
      label: 'Toggle DevTools',
      click: () => win?.webContents.toggleDevTools(),
    },
    {
      label: 'Quit',
      click: () => {
        isQuiting = true
        app.quit()
      },
    },
  ])

  tray.setContextMenu(contextMenu)
  tray.on('click', () => toggleWindow())
  tray.on('double-click', () => { win?.show(); win?.focus() })
}

function toggleWindow() {
  if (!win) return
  if (win.isVisible()) win.hide()
  else { win.show(); win.focus() }
}

app.whenReady().then(createWindow)

app.on('activate', () => {
  if (!win) createWindow()
  else { win.show(); win.focus() }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin' && !tray) {
    app.quit()
    win = null
  }
})

app.on('before-quit', () => {
  isQuiting = true
})
