// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const { SCREEN_SELECTED_NAME, SCREEN_SHOT_NANE } = require('../constants');
const fs = require('fs');
const path = require('path');
const EzzeApi = require('../ezze-api');
const ezzeClient = new EzzeApi();
const { createWorker } = require('tesseract.js');

Menu.setApplicationMenu(null);

ipcMain.on('transform-selected-screen-base64', (event, arg) => {
  const base64 = arg.replace(/^data:image\/\w+;base64,/, "");
  const dataBuffer = new Buffer.from(base64, 'base64');
  fs.writeFile(SCREEN_SELECTED_NAME, dataBuffer, function (err) {
    if (err) {
      console.log(err);
    } else {
      const worker = createWorker({
        logger: m => console.log(m)
      });

      (async () => {
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        const { data: { text } } = await worker.recognize(path.join(process.cwd(), SCREEN_SELECTED_NAME));

        const transformResult = await ezzeClient.transformOnBaiduRetValue(text);

        event.reply('identify-word', {
          identifyWord: text,
          transformResult
        });
        await worker.terminate();
      })();
    }
  })
});

ipcMain.on('re-select', (event, arg) => {
  if (fs.existsSync(path.join(process.cwd(), SCREEN_SELECTED_NAME))) {
    fs.unlink(path.join(process.cwd(), SCREEN_SELECTED_NAME), (err) => {
      if (err) {
        throw err;
      }
    });
  }
});

ipcMain.on('close-window', (event, arg) => {
  if (process.platform !== 'darwin') {
    app.quit()

    if (fs.existsSync(path.join(process.cwd(), SCREEN_SELECTED_NAME))) {
      fs.unlink(path.join(process.cwd(), SCREEN_SELECTED_NAME), (err) => {
        if (err) {
          throw err;
        }
      });
    }

    if (fs.existsSync(path.join(process.cwd(), SCREEN_SHOT_NANE))) {
      fs.unlink(path.join(process.cwd(), SCREEN_SHOT_NANE), (err) => {
        if (err) {
          throw err;
        }
      });
    }
  }
});

app.on('ready', () => {
  // TODO 通过图片的width 和 height来调整窗口大小
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800 * 0.7,
    webPreferences: {
      nodeIntegration: true
    },
    frame: false
  })

  mainWindow.loadFile(`index.html`);
  // mainWindow.webContents.openDevTools();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()

    if (fs.existsSync(path.join(process.cwd(), SCREEN_SELECTED_NAME))) {
      fs.unlink(path.join(process.cwd(), SCREEN_SELECTED_NAME), (err) => {
        if (err) {
          throw err;
        }
      });
    }

    if (fs.existsSync(path.join(process.cwd(), SCREEN_SHOT_NANE))) {
      fs.unlink(path.join(process.cwd(), SCREEN_SHOT_NANE), (err) => {
        if (err) {
          throw err;
        }
      });
    }
  }
});

function start() {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800 * 0.7,
    webPreferences: {
      nodeIntegration: true
    },
    frame: false
  })

  mainWindow.loadFile(`index.html`);
}

module.exports = {
  start
}