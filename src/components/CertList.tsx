import React, { useEffect, useState } from "react";
import { CertificateCard } from "./CertificateCard";
import { useCertificateStore, useUserStore } from "../store";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Certificate } from "../types/Certificate";
import { RemoteCertificateModal } from "./RemoteCertificateModal";
export const CertList = ({
  setModal,
}: {
  setModal: React.Dispatch<React.SetStateAction<Certificate | null>>;
}) => {
  const [search, setSearch] = useState<string>("");
  const [hideExpired, setHideExpired] = useState<boolean>(false);
  const certificates = useCertificateStore((state) => state.certificates);
  const remoteCertificates = useCertificateStore(
    (state) => state.remoteCertificates
  );
  const token = useUserStore((state) => state.token);
  useEffect(() => {
    // Fetch certificates from the main process via IPC
    window.api
      .sendRequest({
        method: "GET",
        url: `http://localhost:3001/cert`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((certs: { data: Certificate[] }) => {
        // Parse the certificates and set them in the store
        // the certificates that are remote true are stored in remoteCertificates
        // other certificates are stored in notifications
        useCertificateStore.setState({
          notifications: certs.data.filter((cert: Certificate) => !cert.remote),
        });
        useCertificateStore.setState({
          remoteCertificates: certs.data.filter(
            (cert: Certificate) => cert.remote
          ),
        });
      })
      .catch((error: string) =>
        console.error("Error fetching certificates: ", error)
      );
  }, [token]);
  return (
    <>
      <div className="border-gray-300 border shadow-sm h-16 mb-4 rounded-lg flex justify-between items-center p-2">
        <RemoteCertificateModal />

        <div className="flex items-center p-2 gap-4">
          <Input
            className="mx-2 w-48"
            type="text"
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
          />
          <div>
            <Label htmlFor="hideExpired" className="mr-2">
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
      </div>
      <ul>
        {remoteCertificates.length> 0 && <h2 className="text-lg font-bold text-center my-2">Remote Certificates</h2>}
        {remoteCertificates
          .filter((cert : Certificate) => !hideExpired || cert.timeRemaining)
          .filter(
            (cert: Certificate) =>
              !search ||
              cert.Subject.toLowerCase().includes(search.toLowerCase())
          )
          .map((cert: Certificate) => (
            <CertificateCard
              key={cert.Thumbprint}
              cert={cert}
              setModal={setModal}
            />
          ))}
        <h2 className="text-lg font-bold text-center my-2">Local Certificates</h2>
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
                  setModal={setModal}
                />
              )
          )}
      </ul>
    </>
  );
};
