// src/global.d.ts
interface Window {
  api: {
    sendRequest: (options: {
      data: unknown;
      method: string;
      url: string;
    }) => Promise<unknown>;
  };
}