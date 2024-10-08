import React, { useEffect, useState } from "react";
import { Certificate } from "./types/Certificate";
import { CertificateCard } from "./components/CertificateCard";
// import { createRoot } from "react-dom/client";

function ParseCertificates(certificates: string): Certificate[] {
  const lines = certificates.split("\n");
  //strip \r from the end of each line
  for (let i = 0; i < lines.length; i++) {
    lines[i] = lines[i].replace("\r", "");
  }
  const certs: Certificate[] = [];
  let cert: Certificate = {
    Subject: "",
    Issuer: "",
    Thumbprint: "",
    FriendlyName: "",
    NotBefore: "",
    NotAfter: "",
    Extensions: "",
    timeRemaining: 0,
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("Subject")) {
      cert.Subject = line.split(":")[1].trim();
    } else if (line.startsWith("Issuer")) {
      cert.Issuer = line.split(":")[1].trim();
    } else if (line.startsWith("Thumbprint")) {
      cert.Thumbprint = line.split(":")[1].trim();
    } else if (line.startsWith("FriendlyName")) {
      cert.FriendlyName = line.split(":")[1].trim();
    } else if (line.startsWith("NotBefore")) {
      cert.NotBefore = line.split(":")[1].trim().split(" ")[0];
    } else if (line.startsWith("NotAfter")) {
      cert.NotAfter = line.split(":")[1].trim().split(" ")[0];
    } else if (line.startsWith("Extensions")) {
      cert.Extensions = line.split(":")[1].trim();
    } else if (line === "") {
      // Calculate the time remaining for the certificate
      const now = new Date();
      const [day, month, year] = cert.NotAfter.split(".");
      const notAfter = new Date(`${year}-${month}-${day}`);
      const timeRemainingMs = notAfter.getTime() - now.getTime();
      const timeRemainingDays =
        timeRemainingMs > 0
          ? Math.ceil(timeRemainingMs / (1000 * 60 * 60 * 24))
          : null;
      // if timeRemaining is negative, the certificate is expired and null
      cert.timeRemaining = timeRemainingDays;
      certs.push(cert);
      cert = {
        Subject: "",
        Issuer: "",
        Thumbprint: "",
        FriendlyName: "",
        NotBefore: "",
        NotAfter: "",
        Extensions: "",
        timeRemaining: 0,
      };
    }
  }
  //sort the certificates by time remaining
  certs.sort((a, b) => {
    if (a.timeRemaining === null) {
      return 1;
    }
    if (b.timeRemaining === null) {
      return -1;
    }
    return a.timeRemaining - b.timeRemaining;
  });
  return certs;
}
const App = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [search, setSearch] = useState<string>("");
  const [hideExpired, setHideExpired] = useState<boolean>(false);
  useEffect(() => {
    // Fetch certificates from the main process via IPC
    window.api
      .getCertificates()
      .then((certs: string) => {
        const parsedCerts = ParseCertificates(certs);
        setCertificates(parsedCerts);
      })
      .catch((error: string) =>
        console.error("Error fetching certificates: ", error)
      );
  }, []);
  return (
    <div className="px-5">
      <h1 className="font-bold">Your local Certificates</h1>
      <div className="border-gray-300 border shadow-sm h-16 mb-4 rounded-lg flex items-center">
        <input
          className="border h-12 px-2 mx-2 rounded-lg"
          type="text"
          placeholder="Search"
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="justify-self-end w-full flex justify-end mr-2">
          <label htmlFor="hideExpired" className="mr-2">
            Hide expired
          </label>
          <input
            type="checkbox"
            id="hideExpired"
            name="hideExpired"
            checked={hideExpired}
            onChange={() => setHideExpired((prev) => !prev)}
          />
        </div>
      </div>
      {!search ? (
        <ul>
          {certificates
            .filter((cert) => !hideExpired || cert.timeRemaining)
            .map(
              (cert) =>
                cert.Thumbprint && (
                  <CertificateCard key={cert.Thumbprint} cert={cert} />
                )
            )}
        </ul>
      ) : (
        <ul>
          {certificates
            .filter((cert) =>
              cert.Subject.toLowerCase().includes(search.toLowerCase())
            )
            .map(
              (cert) =>
                cert.Thumbprint && (
                  <CertificateCard key={cert.Thumbprint} cert={cert} />
                )
            )}
        </ul>
      )}
    </div>
  );
};

// createRoot(document.body).render(<App />);
export default App;
