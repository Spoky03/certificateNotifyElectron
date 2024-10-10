import React, { useState } from "react";
// export const EmailModal = ({
//   userEmail,
//   setUserEmail,
// }: {
//   userEmail: string;
//   setUserEmail: React.Dispatch<React.SetStateAction<string>>;
// }) => {
//   const [email, setEmail] = useState("");
//   return (
//     <div>
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//         <div className="bg-white p-4 rounded-lg">
//           <div className="flex justify-between">
//             <h2 className="font-bold">Set Email</h2>
//           </div>
//           <div className="h-0.5 w-full bg-black"> </div>
//           <form
//             className="bg-white py-2 rounded-lg flex gap-2 justify-between"
//             onSubmit={(e) => {
//               e.preventDefault();
//               setUserEmail(email);
//               window.api.setUserEmail(email);
//             }}
//           >
//             <div>
//               <label htmlFor="email" className="font-bold">
//                 Email:
//               </label>
//               <input
//                 className="border h-12 px-2 mx-2 rounded-lg"
//                 type="text"
//                 placeholder="Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>
//             <button className="font-bold border place-self-start px-2 rounded-md">
//               Set Email
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

import { Button } from "./ui/Button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/AlertDialog";
import { Input } from "./ui/Input";

export function EmailModal({
  userEmail,
  setUserEmail,
}: {
  userEmail: string;
  setUserEmail: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [email, setEmail] = useState("");
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost">📧</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Set email</AlertDialogTitle>
          <AlertDialogDescription>
            Notifications will be sent to this email
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div>
          <Input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={!email}
            onClick={() => {
              setUserEmail(email);
              window.api.setUserEmail(email);
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
