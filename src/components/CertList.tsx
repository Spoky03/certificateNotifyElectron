import React, { useEffect, useState } from "react";
import { CertificateCard } from "./CertificateCard";
import { useCertificateStore, useUserStore } from "../store";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Certificate } from "../types/Certificate";
export const CertList = ({
  setModal,
}: {
  setModal: React.Dispatch<React.SetStateAction<Certificate | null>>;
}) => {
  const [search, setSearch] = useState<string>("");
  const [hideExpired, setHideExpired] = useState<boolean>(false);
  const certificates = useCertificateStore((state) => state.certificates);
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
      .then((certs: any) => {
        useCertificateStore.setState({ notifications: certs.data });
      })
      .catch((error: string) =>
        console.error("Error fetching certificates: ", error)
      );
  }, [token]);
  return (
    <>
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
                  setModal={setModal}
                />
              )
          )}
      </ul>
    </>
  );
};
