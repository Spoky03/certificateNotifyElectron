import React, { useState } from "react";

import { Button } from "./ui/Button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/Dialog"
import { Input } from "./ui/Input"
import { useUserStore } from "../store"

export function GlobalNotificationModal() {
  const [days, setDays] = useState<number>(0);
  const globalNotification = useUserStore((state) => state.globalNotification);
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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">🌐 - {globalNotification}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Global Notification</DialogTitle>
          <DialogDescription>
          When any certificate in about to expire in X days send notification.
          </DialogDescription>
        </DialogHeader>
        <form
            className="bg-white py-2 rounded-lg flex flex-col gap-2 justify-between"
            onSubmit={(e) => {
              e.preventDefault();
              sendGlobalNotification();
            }}
          >
            <div className="flex gap-2 self-center">
              <Input
                type="text"
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
              />
              <Button
                type="submit"
              >
                Set
              </Button>
            </div>
          </form>

        {/* <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  )
}
