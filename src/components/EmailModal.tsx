import React, { useState } from "react";
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
import { useUserStore } from "../store";
import { ClearStorage } from "../lib/utils";

export function EmailModal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  function Login() {
    window.api
      .sendRequest({
        method: "POST",
        url: `http://localhost:3001/login`,
        data: { email, password },
      })
      .then((res: any) => {
        console.log(res);
        if (res.data.auth) {
          useUserStore.setState({ token: res.data.token });
          useUserStore.setState({ email });
          window.api.setLocalStorage("email", email);
          window.api.setLocalStorage("token", res.data.token);
          window.api.setLocalStorage("exp", res.data.exp);
        } else {
          console.error("Invalid email or password");
        }
      })
      .catch((error: string) => console.error("Error logging in: ", error));
  }
  function Register() {
    if (
      password !== confirmPassword ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      console.error("Passwords do not match");
      return;
    }
    window.api
      .sendRequest({
        method: "POST",
        url: `http://localhost:3001/register`,
        data: { email, password },
      })
      .then((res: any) => {
        if (res.data.auth) {
          useUserStore.setState({ token: res.data.token });
          useUserStore.setState({ email });
          window.api.setLocalStorage("email", email);
          window.api.setLocalStorage("token", res.data.token);
        } else {
          console.error("Invalid email or password");
        }
      })
      .catch((error: string) => console.error("Error logging in: ", error));
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost">📧</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          {showRegister ? (
            <AlertDialogTitle>
              Register /{" "}
              <button
                onClick={() => setShowRegister(false)}
                className="text-blue-500"
              >
                Login
              </button>
            </AlertDialogTitle>
          ) : (
            <AlertDialogTitle>
              Login /{" "}
              <button
                onClick={() => setShowRegister(true)}
                className="text-blue-500"
              >
                Register
              </button>
            </AlertDialogTitle>
          )}
          <AlertDialogDescription className="flex flex-col">
            <span> Notifications will be sent to this email</span>
            <button className="text-blue-500"
              onClick={ClearStorage}
            >Logout</button>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {showRegister && (
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {showRegister ? (
            <AlertDialogAction
              onClick={() => {
                Register();
              }}
            >
              Register
            </AlertDialogAction>
          ) : (
            <AlertDialogAction
              disabled={!email}
              onClick={() => {
                Login();
              }}
            >
              Login
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
