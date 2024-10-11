// global.d.ts
export {};

declare global {
  interface Window {
    api: {
      getCertificates: () => Promise<string>;
      getRemoteCertificates: (command: string) => Promise<string>;
      getLocalStorage: (key: string) => Promise<string>;
      setLocalStorage: (key: string, value: string) => Promise<void>;
      sendRequest: (request: unknown) => Promise<unknown>;
    };
  }
}
