import React from "react";
import { Button } from "./ui/Button";
import { GlobalNotificationModal } from "./GlobalNotificationModal";
import { EmailModal } from "./EmailModal";

export const Navbar = ({
  email,
  setUserEmail,
  userEmail,
}: {
  email: string;
  setUserEmail: React.Dispatch<React.SetStateAction<string>>;
  userEmail: string;
}) => {
  return (
    <div className="flex bg-primary text-secondary p-4 mb-2 w-full justify-between items-center">
      <h1 className="font-bold w-fit">Certificate Manager</h1>
      <div className="space-x-2">
        <span>{email}</span>
        <EmailModal userEmail={userEmail} setUserEmail={setUserEmail} />
        <GlobalNotificationModal />
      </div>
    </div>
  );
};
