const { app, BrowserWindow, ipcMain, shell } = require('electron');
const { spawn } = require('child_process');
const os = require('os');
const path = require('path');
const net = require('net');

let frontendProcess, backendProcess;
let mainWindow;
let frontendURL

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon : path.join(__dirname,'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('index.html');
}

// Get local network IP
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Wait until a port is open
function waitForPort(port, host) {
  return new Promise((resolve) => {
    const timer = setInterval(() => {
      const socket = net.createConnection(port, host);
      socket.once('connect', () => {
        clearInterval(timer);
        socket.end();
        resolve(`http://${host}:${port}`);
      });
      socket.on('error', () => {
        socket.destroy();
      });
    }, 500);
  });
}

app.whenReady().then(createWindow);

ipcMain.handle('start-projects', async () => {
  const localIP = getLocalIP();

  // Start backend
  if (!backendProcess) {
    backendProcess = spawn('npm', ['run', 'dev'], {
      cwd: path.join(__dirname, '../backend'),
      shell: true,
      stdio: 'inherit'
    });
    backendProcess.on('close', () => backendProcess = null);
  }

  // Start frontend
  if (!frontendProcess) {
    frontendProcess = spawn('npm', ['run', 'dev'], {
      cwd: path.join(__dirname, '../frontend'),
      shell: true,
      stdio: 'inherit'
    });
    frontendProcess.on('close', () => frontendProcess = null);

    // Wait for frontend to start
     frontendURL = await waitForPort(5173, localIP);
    return frontendURL; // Send back to renderer
  }

  return null;
});

ipcMain.on("open-link", (event, route) => {
  if (frontendURL) {
    shell.openExternal(`${frontendURL}${route}`);
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('quit', () => {
  if (frontendProcess) frontendProcess.kill();
  if (backendProcess) backendProcess.kill();
});


