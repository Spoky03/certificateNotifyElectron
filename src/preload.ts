import { contextBridge, ipcRenderer } from 'electron';

try {
  // Expose a limited API to the renderer process
  contextBridge.exposeInMainWorld('api', {
    getCertificates: () => ipcRenderer.invoke('get-certificates'),
    getRemoteCertificates: (command: string) => ipcRenderer.invoke('get-remote-certificates', command),
    getLocalStorage: (key: string) => ipcRenderer.invoke('get-local-storage', key),
    setLocalStorage: (key: string, value: string) => ipcRenderer.invoke('set-local-storage', key, value),
    sendRequest: (request: unknown) => ipcRenderer.invoke('request', request),
  });
  
  console.log('preload.ts loaded successfully');
} catch (error) {
  console.error('Error in preload.ts:', error);
}
