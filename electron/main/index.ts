import { app, BrowserWindow, shell, ipcMain, dialog  } from 'electron'
import { release } from 'node:os'
import { createRequire } from "module"; 
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url); 

if(require('electron-squirrel-startup')) app.quit();

const { updateElectronApp } = require('update-electron-app');
const fs = require('fs')
const axios = require('axios');
const os = require('os');
const path = require('path');
const sharp = require('sharp');
const ffmpeg = require('@ffmpeg-installer/ffmpeg').path.replace('app.asar', 'app.asar.unpacked');
const ffmpegProcess = require('fluent-ffmpeg');
const notifier = require('node-notifier');

ffmpegProcess.setFfmpegPath(ffmpeg);

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

updateElectronApp(); // additional configuration options available
// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = join(process.env.DIST_ELECTRON, '../public')

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.mjs')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')
const icon = app.isPackaged ? join(process.env.PUBLIC, 'linux/icon.png').replace('app.asar', 'app.asar.unpacked') : join(process.env.PUBLIC , 'linux/icon.png')
async function createWindow() {
  win = new BrowserWindow({
    title: 'Drag media',
    icon: icon,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#333333',
      symbolColor: '#fff',
      height: 40
    },
    minWidth: 380,
    minHeight: 400,
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      //nodeIntegration: true,

      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      //contextIsolation: true,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
  // win.webContents.on('will-navigate', (event, url) => { }) #344

}

app.whenReady().then(createWindow)


const createFolderIfNotExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
};

// Obtenemos las carpetas defauld de videos y pictures  
const videosFolder = path.join(os.homedir(), 'Videos', 'Drag-media');
const imagesFolder = path.join(os.homedir(), 'Pictures', 'Drag-media');

createFolderIfNotExists(videosFolder);
createFolderIfNotExists(imagesFolder);

ipcMain.handle('get-folders', () => {
  // Devolver la información de las carpetas al proceso del renderer
  return { videosFolder, imagesFolder };
});


let notificationId;
function showNotification(fileName, fileFormat, icon) {
  
  // Genera un nuevo ID de notificación si es necesario
  notificationId = notificationId || new Date().getTime().toString();

  notifier.notify({
    title: 'Medio descargado', 
    message: `${fileName + fileFormat}, listo para arrastrar`, 
    sound: true,
    wait: false,
    icon: icon,
    id: notificationId,
    appID: 'Drag Media',
    contentImage: icon,
  }, function (err, response, metadata) { 
    if (err) { 
      console.error(err); 
    } else { 
      console.log('Notificación mostrada exitosamente:', response, metadata); 
    }
  });
}

const createThumbnail = async (filePath, fileName, fileType, thumbsFolder, returnPath = false) => {
  const cleanFileName = fileName.replace(/\[.*\]/, '');
  const thumbnailPath = path.join(thumbsFolder, `${cleanFileName}_thumb.jpg`);

  // Crear la carpeta .thumbs si no existe
  if (!fs.existsSync(thumbsFolder)) {
    fs.mkdirSync(thumbsFolder, { recursive: true });
  }

  try {
    if (fileType === "img") {
      const { width, height } = await sharp(filePath).metadata();
      let scaleFactor = 1;

      if (width > 100 || height > 100) {
        scaleFactor = Math.min(100 / width, 100 / height);
      }

      await sharp(filePath)
        .resize({
          width: Math.floor(width * scaleFactor),
          height: Math.floor(height * scaleFactor),
        })
        .png({ quality: 5 })
        .toFile(thumbnailPath);
    } else if (fileType === "video") {
      const tempPngPath = path.join(thumbsFolder, `${cleanFileName}_temp.png`);
      await new Promise((resolve, reject) => {
        ffmpegProcess(filePath)
          .screenshots({
            timestamps: ['00:00:01'],
            filename: path.basename(tempPngPath),
            folder: thumbsFolder,
            size: '10%',
          })
          .on('end', resolve)
          .on('error', reject);
      });

      const { width, height } = await sharp(tempPngPath).metadata();
      let scaleFactor = 1;

      if (width > 100 || height > 100) {
        scaleFactor = Math.min(100 / width, 100 / height);
      }

      await sharp(tempPngPath)
        .resize({
          width: Math.floor(width * scaleFactor),
          height: Math.floor(height * scaleFactor),
        })
        .jpeg({ quality: 30 })
        .toFile(thumbnailPath);

      fs.unlinkSync(tempPngPath);
    }

    return returnPath ? thumbnailPath : true;
  } catch (err) {
    console.error("Error al generar la miniatura:", err);
    return null;
  }
};

ipcMain.on('onDownloadFile', async (event, fileURL, fileID, fileName, fileFormat, fileType, fileDirectorySave) => {
  let filePath;

  if (fileType === "img" && !fileDirectorySave) {
    filePath = path.join(imagesFolder, fileName + fileFormat);
  } else if (fileType === "img" && fileDirectorySave) { 
    filePath = path.join(fileDirectorySave, fileName + fileFormat);
  }

  if (fileType === "video" && !fileDirectorySave) {
    filePath = path.join(videosFolder, fileName + fileFormat);
  } else if (fileType === "video" && fileDirectorySave) { 
    filePath = path.join(fileDirectorySave, fileName + fileFormat);
  }

  if (!fs.existsSync(filePath)) {
    event.sender.send('showLoader', true, fileID);
    try {
      const response = await axios.get(fileURL, { responseType: 'arraybuffer' });
      fs.writeFileSync(filePath, Buffer.from(response.data));

      const baseFolder = fileDirectorySave || (fileType === "img" ? imagesFolder : videosFolder);
      const thumbsFolder = path.join(baseFolder, '.thumbs');

      const thumbnailPath = await createThumbnail(filePath, fileName, fileType, thumbsFolder, true);

      showNotification(fileName, fileFormat, thumbnailPath);
      event.sender.send('file-downloaded', fileName, filePath, thumbnailPath); // Envía el path de la miniatura
    } catch (error) {
      console.error(`Error al descargar el archivo: ${error.message}`);
    } finally {
      event.sender.send('showLoader', false, fileID);
    }
  } else {
    console.log(`El archivo ${fileName + fileFormat} ya existe, no se descargará de nuevo.`);
  }
});

ipcMain.on('ondragstart', async (event, fileURL, fileName, fileFormat, fileType, fileDirectorySave) => {
  const baseFolder = fileDirectorySave || (fileType === "img" ? imagesFolder : videosFolder);
  const filePath = path.join(baseFolder, fileName + fileFormat);

  if (!fs.existsSync(filePath)) {
    console.log(`El archivo no se encuentra, descárguelo para arrastrar.`);
    return;
  }

  const thumbsFolder = path.join(baseFolder, '.thumbs');
  const thumbnailPath = path.join(thumbsFolder, `${fileName.replace(/\[.*\]/, '')}_thumb.jpg`);

  const thumb = fs.existsSync(thumbnailPath)
    ? thumbnailPath
    : await createThumbnail(filePath, fileName, fileType, thumbsFolder, true);

  if (thumb) {
    event.sender.startDrag({
      file: filePath,
      icon: thumb,
    });
  } else {
    console.error("No se pudo generar o encontrar la miniatura.");
  }
});

interface ResponseData {
  photos?: string[];
  videos?: string[];
  error?: any;
}

// Esta funcion devuelve un json
// con los nombres de todos los archivos en el directorio
ipcMain.on('onDirectoryStorage', async (event, photosDirectory, videosDirectory) => {
  const response: ResponseData = {}; // Objeto de respuesta

  // Comprobar si photosDirectory y videosDirectory están definidos y no son cadenas vacías
  if (!photosDirectory || photosDirectory.trim() === '') {
    photosDirectory = imagesFolder; // Usar el valor de imagesFolder si es vacío
  }

  if (!videosDirectory || videosDirectory.trim() === '') {
    videosDirectory = videosFolder; // Usar el valor de videosFolder si es vacío
  }

  // Ahora, puedes realizar la lectura de directorio con las rutas actualizadas
  fs.readdir(photosDirectory, (err: Error, photoFiles: []) => {
    if (err) {
      response.error = err;
    } else {
      response.photos = photoFiles;

      // Realizar la lectura del directorio de videos
      fs.readdir(videosDirectory, (err: Error, videoFiles: []) => {
        if (err) {
          response.error = err;
        } else {
          response.videos = videoFiles;
        }

        // Enviar la respuesta una vez que tengas ambos conjuntos de datos
        event.reply('resquestOnDirectoryStorage', response);
      });
    }
  });
});

// Función para mostrar el cuadro de diálogo de selección de directorio
ipcMain.on('onmodal', async (event, typeFile) => {
  dialog.showOpenDialog({
    properties: ['openDirectory']
  }).then(result => {
    const selectedDirectory = result.filePaths[0];
    event.sender.send('selectedDirectory', selectedDirectory, typeFile);
  }).catch(err => {
    console.log(err);
  });
});

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})
