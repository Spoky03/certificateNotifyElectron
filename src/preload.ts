import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  getCertificates: () => ipcRenderer.invoke('get-certificates'),
});


console.log('preload.ts loaded');