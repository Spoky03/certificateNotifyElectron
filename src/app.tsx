import React, { useEffect, useState } from "react";
import { Certificate } from "./types/Certificate";
import { CertificateCard } from "./components/CertificateCard";
import { SetNotificationModal } from "./components/SetNotificationModal";
import { Navbar } from "./components/Navbar";
import { EmailModal } from "./components/EmailModal";
import { Input } from "./components/ui/Input";
import { Label } from "./components/ui/Label";

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
  const [modalCert, setModalCert] = useState<Certificate | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  useEffect(() => {
    //fetch user email from the main process via IPC
    window.api
      .getUserEmail()
      .then((email: string) => {
        setUserEmail(email);
      })
      .catch((error: string) =>
        console.error("Error fetching user email: ", error)
      );
  }
  , []);
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
    <main>
      <Navbar email={userEmail} setUserEmail={setUserEmail} userEmail={userEmail} />
      <div className="px-5">
        <div className="border-gray-300 border shadow-sm h-16 mb-4 rounded-lg flex items-center justify-between">
          <Input
            className="mx-2 w-48"
            type="text"
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="mr-2">
            <Label htmlFor="hideExpired" className="">
              Hide expired
            </Label>
            <Input
            className="w-6 h-6"
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
                    <CertificateCard
                      key={cert.Thumbprint}
                      cert={cert}
                      setModal={setModalCert}
                    />
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
                    <CertificateCard
                      key={cert.Thumbprint}
                      cert={cert}
                      setModal={setModalCert}
                    />
                  )
              )}
          </ul>
        )}
        <SetNotificationModal cert={modalCert} setModal={setModalCert} />
      </div>
      <div className="w-full text-end">
          <p className="text-xs italic text-slate-500 px-4">Stefan Grzelec 2024</p>
        </div>
    </main>
  );
};

// createRoot(document.body).render(<App />);
export default App;
