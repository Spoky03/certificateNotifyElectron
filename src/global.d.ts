// global.d.ts
export {};

declare global {
  interface Window {
    api: {
      getCertificates: () => Promise<string>;
      getUserEmail: () => Promise<string>;
      setUserEmail: (email: string) => Promise<void>;
      sendRequest: (request: unknown) => Promise<unknown>;
    };
  }
}
