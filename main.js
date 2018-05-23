const config = require('./config.json')

const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Tray = electron.Tray
const Menu = electron.Menu

const path = require('path')
const url = require('url')

const database = require('./database')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, tray

function createWindow () {
  mainWindow = new BrowserWindow({width: 800, height: 600})

  mainWindow.setMenu(null);
  if(config.debug) mainWindow.webContents.openDevTools()
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
    tray = new Tray('icon.png')
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'quit',
            click: ()=>{
                app.quit()
            }
        },
      ])
    tray.setToolTip('Pask is syncing')
    tray.setContextMenu(contextMenu)

    tray.on('click', ()=>{
        if (mainWindow === null) {
          createWindow()
          setTrayMessage(false)
        }
    })
}

function setTrayMessage(sw){
    tray.setImage(sw?'icon_message.png':'icon.png')
}

function listenDat(){
    database.connect()
    database.on('ready', (k)=>{
        console.log(k)
        //setTrayMessage(true)
    })

}

app.on('ready', ()=>{
    createWindow()
    createTray()
    listenDat()
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
