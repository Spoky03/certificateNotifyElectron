import { Certificate } from "../types/Certificate";
import React, { useState } from "react";
import { Button } from "./ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/Dialog";
import { Input } from "./ui/Input";
export function SetNotificationModal({
  cert,
  setModal,
}: {
  cert: Certificate;
  setModal: (cert: Certificate) => void;
}) {
  const [notifyBefore, setNotifyBefore] = useState<number>(0);

  const sendNotification = async () => {
    try {
      const data = await window.api.sendRequest({
        data: {
          Subject: cert.Subject,
          Issuer: cert.Issuer,
          Thumbprint: cert.Thumbprint,
          NotBefore: cert.NotBefore,
          NotAfter: cert.NotAfter,
          timeRemaining: cert.timeRemaining,
          notifyBefore: notifyBefore,
          email: "stefangrzelec@gmail.com",
        },
        method: "POST",
        url: "http://localhost:3001/cert",
      });
      console.log(data);
    } catch (error) {
      console.warn("Failed to send notification:", error);
    }
  };
  return (
    <Dialog open={cert !== null} onOpenChange={() => setModal(null)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Notification</DialogTitle>
          <DialogDescription>
            X days before expiration, send a notification to your email
          </DialogDescription>
        </DialogHeader>
        {cert && (
          <div>
            <div className="flex justify-between">
              <h3 className="text-lg font-bold">
                {cert?.FriendlyName || cert.Subject}
              </h3>
            </div>
            <p className="">{cert.Issuer}</p>
            <div className="mt-4">
              <p>
                <span className="font-bold">
                  {cert.NotBefore.toString()} - {cert.NotAfter.toString()}
                </span>
              </p>
            </div>
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
          </div>
        )}
        <form
          className="bg-white py-2 rounded-lg flex gap-2 justify-between"
          onSubmit={(e) => {
            e.preventDefault();
            setModal(null);
            sendNotification();
          }}
        >
          <div className="flex gap-2 w-full justify-center">
            <Input
              type="text"
              id="notification"
              className="w-16"
              value={notifyBefore}
              onChange={(e) => setNotifyBefore(parseInt(e.target.value))}
            />
            <Button type="submit">Set</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

