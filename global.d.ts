interface Window {
    api: {
      getCertificates: () => Promise<string>;
    };
  }