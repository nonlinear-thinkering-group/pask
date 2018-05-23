const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')

const database = require('./database')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, tray

function createWindow () {
  mainWindow = new BrowserWindow({width: 800, height: 600})

  mainWindow.setMenu(null);
  mainWindow.webContents.openDevTools()
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.webContents.on('new-window', function(e, url) {
    e.preventDefault();
    electron.shell.openExternal(url);
  });

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

function createTray(){
    tray = new electron.Tray('icon.png')
    const contextMenu = electron.Menu.buildFromTemplate([
        {
            label: 'quit',
            click: ()=>{
                app.quit()
            }
        },
      ])
    tray.setToolTip('This is my application.')
    tray.setContextMenu(contextMenu)

    tray.on('click', ()=>{
        if (mainWindow === null) {
          createWindow()
        }
    })
}

function listendat(){
    database.connect()
    database.on('ready', ()=>{
        console.log(database.getKey())
    })
}

app.on('ready', ()=>{
    createWindow()
    createTray()
    listendat()
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
//    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
