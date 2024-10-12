import React from "react";
import { GlobalNotificationModal } from "./GlobalNotificationModal";
import { EmailModal } from "./EmailModal";
import { useUserStore } from "../store";

export const Navbar = () => {
  const email = useUserStore((state) => state.email);
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
