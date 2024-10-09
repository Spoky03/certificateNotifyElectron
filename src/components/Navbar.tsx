import React from "react";

export const Navbar = ({ email }: { email: string }) => {
  return (
    <div className="flex bg-slate-500 text-white p-4 mb-2 w-full justify-between items-center">
      <h1 className="font-bold w-fit">Certificate Manager</h1>
      <div>
        <span>{email}</span>
      </div>
    </div>
  );
};
