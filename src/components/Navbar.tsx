import React, { useEffect } from "react";
import { GlobalNotificationModal } from "./GlobalNotificationModal";
import { EmailModal } from "./EmailModal";
import { useUserStore } from "../store";

export const Navbar = () => {
  const email = useUserStore((state) => state.email);
  const token = useUserStore((state) => state.token);
  useEffect(() => {
    // send get request to /globalNotification
    window.api
    .sendRequest({
      method: "GET",
      url: `http://localhost:3001/globalNotification`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    )
    .then((res: { data: number }) => {
      useUserStore.setState({ globalNotification: res.data });
    })
    .catch((error: string) =>
      console.error("Error fetching global notification: ", error)
    );
  }
  , [token]);
  return (
    <div className="flex bg-primary text-secondary p-4 mb-2 w-full justify-between items-center">
      <h1 className="font-bold w-fit">Certificate Manager</h1>
      <div className="space-x-2">
        <span>{email}</span>
        <EmailModal />
        <GlobalNotificationModal />
      </div>
    </div>
  );
};
