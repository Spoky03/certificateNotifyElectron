import React, { useEffect, useState } from "react";
// import { createRoot } from "react-dom/client";

const App = () => {
  const [certificates, setCertificates] = useState<string>(
    "Loading certificates..."
  );

  useEffect(() => {
    // Fetch certificates from the main process via IPC
    window.api
      .getCertificates()
      .then((certs: string) => setCertificates(certs))
      .catch((error: string) =>
        setCertificates(`Error fetching certificates: ${error}`)
      );
  }, []);
  return (
    <div>
      <h1>Your local Certificates</h1>
      <pre>{certificates}</pre>
    </div>
  );
};

// createRoot(document.body).render(<App />);
export default App;
