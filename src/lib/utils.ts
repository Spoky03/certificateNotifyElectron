import { useUserStore } from "../store";
import { Certificate } from "@/types/Certificate";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function ClearStorage() {
  window.api.setLocalStorage("email", "");
  window.api.setLocalStorage("token", "");
  useUserStore.setState({ email: "" });
  useUserStore.setState({ token: "" });
}
export function ParseCertificates(certificates: string): Certificate[] {
  const lines = certificates.split("\n");
  //strip \r from the end of each line
  for (let i = 0; i < lines.length; i++) {
    lines[i] = lines[i].replace("\r", "");
  }
  const certs: Certificate[] = [];
  let cert: Certificate = {
    Subject: "",
    Issuer: "",
    Thumbprint: "",
    FriendlyName: "",
    NotBefore: "",
    NotAfter: "",
    Extensions: "",
    timeRemaining: 0,
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("Subject")) {
      cert.Subject = line.split(":")[1].trim();
    } else if (line.startsWith("Issuer")) {
      cert.Issuer = line.split(":")[1].trim();
    } else if (line.startsWith("Thumbprint")) {
      cert.Thumbprint = line.split(":")[1].trim();
    } else if (line.startsWith("FriendlyName")) {
      cert.FriendlyName = line.split(":")[1].trim();
    } else if (line.startsWith("NotBefore")) {
      cert.NotBefore = line.split(":")[1].trim().split(" ")[0];
    } else if (line.startsWith("NotAfter")) {
      cert.NotAfter = line.split(":")[1].trim().split(" ")[0];
    } else if (line.startsWith("Extensions")) {
      cert.Extensions = line.split(":")[1].trim();
    } else if (line === "") {
      // Calculate the time remaining for the certificate
      const now = new Date();
      const [day, month, year] = cert.NotAfter.split(".");
      const notAfter = new Date(`${year}-${month}-${day}`);
      const timeRemainingMs = notAfter.getTime() - now.getTime();
      const timeRemainingDays =
        timeRemainingMs > 0
          ? Math.ceil(timeRemainingMs / (1000 * 60 * 60 * 24))
          : null;
      // if timeRemaining is negative, the certificate is expired and null
      cert.timeRemaining = timeRemainingDays;
      certs.push(cert);
      cert = {
        Subject: "",
        Issuer: "",
        Thumbprint: "",
        FriendlyName: "",
        NotBefore: "",
        NotAfter: "",
        Extensions: "",
        timeRemaining: 0,
      };
    }
  }
  //sort the certificates by time remaining
  certs.sort((a, b) => {
    if (a.timeRemaining === null) {
      return 1;
    }
    if (b.timeRemaining === null) {
      return -1;
    }
    return a.timeRemaining - b.timeRemaining;
  });
  return certs;
}

