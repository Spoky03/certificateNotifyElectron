import React, { useEffect, useState } from "react";
import { Certificate } from "./types/Certificate";
import { CertificateCard } from "./components/CertificateCard";
import { SetNotificationModal } from "./components/SetNotificationModal";
import { Navbar } from "./components/Navbar";
import { Input } from "./components/ui/Input";
import { Label } from "./components/ui/Label";
import { ParseCertificates } from "./lib/utils";
import { Footer } from "./components/Footer";


const App = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [search, setSearch] = useState<string>("");
  const [hideExpired, setHideExpired] = useState<boolean>(false);
  const [modalCert, setModalCert] = useState<Certificate | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [notifications, setNotifications] = useState<any>([]);
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
  }, []);
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
  useEffect(() => {
    // Fetch certificates from the main process via IPC
    window.api
      .sendRequest({
        method: "GET",
        url: `http://localhost:3001/cert?email=${userEmail}`,
      })
      .then((certs: any) => {
        setNotifications(certs);
      })
      .catch((error: string) =>
        console.error("Error fetching certificates: ", error)
      );
  }, [userEmail]);
  return (
    <main>
      <Navbar
        email={userEmail}
        setUserEmail={setUserEmail}
        userEmail={userEmail}
      />
      <div className="px-5">
        {/* {notifications && (
          <pre className="text-xs text-slate-500">
            {JSON.stringify(notifications, null, 2)}
          </pre>
        )} */}
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
        <ul>
          {certificates
            .filter((cert) => !hideExpired || cert.timeRemaining)
            .filter(
              (cert) =>
                !search ||
                cert.Subject.toLowerCase().includes(search.toLowerCase())
            )
            .map(
              (cert) =>
                cert.Thumbprint && (
                  <CertificateCard
                    key={cert.Thumbprint}
                    cert={cert}
                    setModal={setModalCert}
                    notifications={notifications.data}
                  />
                )
            )}
        </ul>

        <SetNotificationModal cert={modalCert} setModal={setModalCert} />
      </div>
      <Footer />
    </main>
  );
};

export default App;
