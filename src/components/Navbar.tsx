import React from "react";
const ProfileImage = ({ src }: { src: string }) => {
  return <img className="rounded-full w-12 h-12" src={src} alt="profile" />;
};
export const Navbar = () => {
  return (
    <div className="flex bg-slate-500 text-white p-4 mb-2 w-full justify-between items-center">
      <h1 className="font-bold w-fit">Certificate Manager</h1>
      <ProfileImage src="https://placehold.co/200x200/png" />
    </div>
  );
};
