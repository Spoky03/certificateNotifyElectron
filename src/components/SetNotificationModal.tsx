import { Certificate } from "../types/Certificate";
import React from "react";
export const SetNotificationModal = ({
  cert,
  setModal,
}: {
  cert: Certificate;
  setModal: (cert: Certificate) => void;
}) => {
  return (
    <div>
      {cert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg">
            <div className="flex justify-between">
              <h2 className="font-bold">Set Notification</h2>
              <button
                className="text-red-500 font-bold place-self-start px-2 rounded-md"
                onClick={() => setModal(null)}
              >
                X
              </button>
            </div>
            <div className="h-0.5 w-full bg-black"> </div>
            <div>
              <div className="flex justify-between">
                <h3 className="text-lg font-bold">
                  {cert.FriendlyName || cert.Subject}
                </h3>
              </div>
              <p className="text-gray-600">{cert.Issuer}</p>
              <div className="mt-4">
                <p>
                  <span className="font-bold">
                    {cert.NotBefore.toString()} - {cert.NotAfter.toString()}
                  </span>
                </p>
              </div>
              {cert.timeRemaining ? (
                <p className="text-green-500 text-xl">
                  Expires in
                  {cert.timeRemaining > 1
                    ? ` ${cert.timeRemaining} days`
                    : " less than a day"}
                </p>
              ) : (
                <p className="text-red-500">Expired</p>
              )}
            </div>
            <form
              className="bg-white py-2 rounded-lg flex gap-2 justify-between"
              onSubmit={(e) => {
                e.preventDefault();
                setModal(null);
              }}
            >
              <div>
                  <label htmlFor="notification" className="font-bold">Notification:</label>
                  <p className="text-xs">
                    X days before expiration, send a notification to your email
                  </p>
              </div>
              <div className="flex gap-2 self-end">
                  <input
                    type="text"
                    id="notification"
                    className="border border-gray-300 rounded-lg w-12"
                  />
                  <button
                    type="submit"
                    className="bg-green-500 text-white rounded-lg px-2 py-1"
                  >
                    Set
                  </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
