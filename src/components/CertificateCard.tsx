import React, { useState } from "react";
export const CertificateCard = ({ cert }: { cert: any }) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  return (
    <li
      key={cert.Thumbprint}
      className="p-4 border border-gray-300 rounded-lg shadow-md mb-2"
    >
      <div className="flex justify-between">
        <h3 className="text-lg font-bold">
          {cert.FriendlyName || cert.Subject}
        </h3>
        <button
          className="font-bold border place-self-start px-2 rounded-md"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? "Hide" : "Expand"}
        </button>
      </div>
      <p className="text-gray-600">{cert.Issuer}</p>
      {cert.timeRemaining ? (
        <p className="text-green-500">
          Expires in
          {cert.timeRemaining > 1
            ? ` ${cert.timeRemaining} days`
            : " less than a day"}
        </p>
      ) : (
        <p className="text-red-500">Expired</p>
      )}

      {expanded && (
        <div className="mt-4">
          <p>
            <span className="font-bold">Thumbprint:</span> {cert.Thumbprint}
          </p>
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
          <p>
            <span className="font-bold">Extensions:</span> {cert.Extensions}
          </p>
        </div>
      )}
    </li>
  );
};
