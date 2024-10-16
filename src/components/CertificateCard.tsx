import { useCertificateStore } from "../store";
import { Certificate } from "../types/Certificate";
import React, { useState } from "react";
export const CertificateCard = ({
  cert,
  setModal,
}: {
  cert: Certificate;
  setModal: (cert: Certificate) => void;
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const notifications = useCertificateStore((state) => state.notifications);
  const notificationAmount = Array.isArray(notifications)
    ? notifications.find((n: Certificate) => n.Thumbprint === cert.Thumbprint)
        ?.notifyBefore
    : 0;
  return (
    <li
      key={cert.Thumbprint}
      className={`p-4 border border-gray-300 rounded-lg shadow-md mb-2 ${cert.remote ? 'bg-blue-50' : ''}`}
    >
      <div className="flex justify-between">
        <h3 className="text-lg font-bold">
          {cert.FriendlyName || cert.Subject}
        </h3>
        <div className="space-x-2">
          <button
            className="font-bold border place-self-start px-2 rounded-md"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? "⬆️" : "⬇️"}
          </button>
          <button
            className="font-bold border place-self-start px-2 rounded-md"
            onClick={() => setModal(cert)}
          >
            🔔 {notificationAmount ? `| ${notificationAmount}` : (cert.remote ? cert.notifyBefore : '')}
          </button>
        </div>
      </div>
      <p className="text-gray-600">{cert.Issuer}</p>
      {cert.timeRemaining ? (
        <p className={cert.timeRemaining < notificationAmount ? 'text-red-500' : 'text-green-500'} >
          Expires in
          {cert.timeRemaining > 1
            ? ` ${cert.timeRemaining} days`
            : " less than a day"}
        </p>
      ) : (
        <p className="text-red-800">Expired</p>
      )}

      {expanded && (
        <div className="mt-4">
          {!cert.remote && <p>
            <span className="font-bold">Thumbprint:</span> {cert.Thumbprint}
          </p>}
          {/* <p>
            <span className="font-bold">From:</span>{" "}
            {cert.NotBefore.toString()}
          </p>
          <p>
            <span className="font-bold">To:</span>{" "}
            {cert.NotAfter.toString()}
          </p> */}
          <p>
            <span className="font-bold">
              {cert.NotBefore.toString()} - {cert.NotAfter.toString()}
            </span>
          </p>
          {!cert.remote&&<p>
            <span className="font-bold">Extensions:</span> {cert.Extensions}
          </p>}
        </div>
      )}
    </li>
  );
};
