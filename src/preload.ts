import { contextBridge, ipcRenderer } from 'electron';

try {
  // Expose a limited API to the renderer process
  contextBridge.exposeInMainWorld('api', {
    getCertificates: () => ipcRenderer.invoke('get-certificates'),
    sendRequest: (request: unknown) => ipcRenderer.invoke('request', request),
  });
  
  console.log('preload.ts loaded successfully');
} catch (error) {
  console.error('Error in preload.ts:', error);
}
