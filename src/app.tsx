import React, { useEffect, useState } from "react";
import { Certificate } from "./types/Certificate";
import { SetNotificationModal } from "./components/SetNotificationModal";
import { Navbar } from "./components/Navbar";
import { ClearStorage, ParseCertificates } from "./lib/utils";
import { Footer } from "./components/Footer";
import { useUserStore, useCertificateStore } from "./store";
import { CertList } from "./components/CertList";
import { Toaster } from "./components/ui/toaster";
import { useToast } from "./components/hooks/use-toast";
import { RemoteCertificateCard } from "./components/RemoteCertificateCard";
import { RemoteCertificateModal } from "./components/RemoteCertificateModal";

const App = () => {
  const [modalCert, setModalCert] = useState<Certificate | null>(null);
  const { toast } = useToast();
  useEffect(() => {
    // Fetch certificates from the main process via IPC
    window.api
      .getCertificates()
      .then((certs: string) => {
        const parsedCerts = ParseCertificates(certs);
        useCertificateStore.setState({ certificates: parsedCerts });
      })
      .catch((error: string) =>
        console.error("Error fetching certificates: ", error)
      );
  }, []);
  useEffect(() => {
    //fetch user email from the main process via IPC
    window.api
      .getLocalStorage("exp")
      .then((exp: string) => {
        if (Number(exp) < Date.now()) {
          ClearStorage();
          toast({
            title: "Your session has expired",
            description: `Please login again to continue`,
          })
          useUserStore.setState({ email: "" });
          useUserStore.setState({ token: "" });
        }
      })
      .catch(() => ClearStorage());
    window.api
      .getLocalStorage("email")
      .then((email: string) => {
        useUserStore.setState({ email });
      })
      .catch((error: string) =>
        console.error("Error fetching user email: ", error)
      );
    window.api
      .getLocalStorage("token")
      .then((token: string) => {
        useUserStore.setState({ token });
      })
      .catch((error: string) =>
        console.error("Error fetching user token: ", error)
      );
  }, []);
  return (
    <main>
      <Navbar />
      <div className="px-5">
        <RemoteCertificateModal />
        <RemoteCertificateCard />
        <CertList setModal={setModalCert} />
        <SetNotificationModal cert={modalCert} setModal={setModalCert} />
      </div>
      <Footer />
      <Toaster />
    </main>
  );
};

export default App;
