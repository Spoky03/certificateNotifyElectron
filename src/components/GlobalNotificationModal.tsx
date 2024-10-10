import React, { useState } from "react";
export const GlobalNotificationModal = ({
  setModal,

}: {
  setModal: (arg: unknown) => void;
}) => {
  const [days, setDays] = useState<number>(0);
  const sendGlobalNotification = async () => {
    try {
      const data = await window.api.sendRequest({
        data: {
          days: days,
          email: "stefangrzelec@gmail.com",
        },
        method: "PUT",
        url: "http://localhost:3001/globalNotification",
      });
      console.log(data);
    } catch (error) {
      console.warn("Failed to send notification:", error);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg">
        <div className="flex justify-between">
          <h2 className="font-bold">Set Global Notification</h2>
          <button
            className="text-red-500 font-bold place-self-start px-2 rounded-md"
            onClick={() => setModal(false)}
          >
            X
          </button>
        </div>
        <div className="h-0.5 w-full bg-black"> </div>
        <div>
          <form
            className="bg-white py-2 rounded-lg flex flex-col gap-2 justify-between"
            onSubmit={(e) => {
              e.preventDefault();
              sendGlobalNotification();
            }}
          >
            <label htmlFor="notification">
              {" "}
              When any certificate in about to expire in X days send notification
            </label>

            <div className="flex gap-2 self-center">
              <input
                type="text"
                id="notification"
                className="border border-gray-300 rounded-lg w-12"
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
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
    </div>
  );
};
