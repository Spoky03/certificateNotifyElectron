import { ArrowBigRight } from "lucide-react";

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
import { Label } from "./ui/Label";
import React, { useState } from "react";
import { useCertificateStore, useUserStore } from "../store";
import { useToast } from "./hooks/use-toast";
import { Certificate } from "../types/Certificate";
function parseCertificateData(response: string): Certificate[] {
  const certificates: Certificate[] = [];
  
  // Regex patterns to extract Subject, Issuer, NotBefore, and NotAfter
  const subjectPattern = /s:(.*)/g;
  const issuerPattern = /i:(.*)/g;
  const notBeforePattern = /NotBefore: ([A-Za-z]{3} \d{2} \d{2}:\d{2}:\d{2} \d{4} GMT)/g;
  const notAfterPattern = /NotAfter: ([A-Za-z]{3} \d{2} \d{2}:\d{2}:\d{2} \d{4} GMT)/g;

  // Split the response into certificate blocks
  const certBlocks = response.split('-----BEGIN CERTIFICATE-----');
  
  certBlocks.forEach((block: string) => {
    const certificate: Certificate = {
      Subject: '',
      Issuer: '',
      NotBefore: '',
      NotAfter: '',
      timeRemaining: null,
    };

    // Extract Subject
    const subjectMatch = subjectPattern.exec(block);
    if (subjectMatch) {
      certificate.Subject = subjectMatch[1].trim();
    }

    // Extract Issuer
    const issuerMatch = issuerPattern.exec(block);
    if (issuerMatch) {
      certificate.Issuer = issuerMatch[1].trim();
    }

    // Extract NotBefore
    const notBeforeMatch = notBeforePattern.exec(block);
    if (notBeforeMatch) {
      certificate.NotBefore = notBeforeMatch[1].trim();
    }

    // Extract NotAfter
    const notAfterMatch = notAfterPattern.exec(block);
    if (notAfterMatch) {
      certificate.NotAfter = notAfterMatch[1].trim();
    }

    const timeRemaining = new Date(certificate.NotAfter).getTime() - Date.now();
    // Calculate time remaining in days
    certificate.timeRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    

    // Only push valid certificates with extracted data
    if (certificate.Subject && certificate.Issuer && certificate.NotBefore && certificate.NotAfter) {
      certificates.push(certificate);
    }

    // Reset regex lastIndex (for exec to work properly in loop)
    subjectPattern.lastIndex = 0;
    issuerPattern.lastIndex = 0;
    notBeforePattern.lastIndex = 0;
    notAfterPattern.lastIndex = 0;
  });

  return certificates;
}
export function RemoteCertificateModal() {
  const [url, setUrl] = useState<string>("");
  const token = useUserStore((state) => state.token);
  const { toast } = useToast();
  function getRemoteCertificates() {
    window.api
      .getRemoteCertificates(url)
      .then((certs: any) => {
        const parsedCerts = parseCertificateData(certs);
        useCertificateStore.setState({ remoteCertificates: parsedCerts });
        toast({
          title: "Remote certificates fetched",
          description: `Fetched certificate`,
        });
        // send the certificates to server
        parsedCerts.forEach((cert) => {
          console.log({ ...cert, remote: true });
          window.api
            .sendRequest({
              method: "POST",
              url: `http://localhost:3001/cert`,
              data: {...cert, remote: true},
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
            )
            .then((cert) => {
              console.log("Certificate added: ", cert);
            })
            .catch((error: string) =>
              console.error("Error adding certificate: ", error)
            );
        });
      })
      .catch((error: string) =>
        console.error("Error fetching remote certificates: ", error)
      );
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Remote Certificate</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add remote certificate</DialogTitle>
          <DialogDescription>
            Enter the URL of the website you want to add a certificate to get
            notified about.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Url to website
            </Label>
            <Input
              id="link"
              type="text"
              value={url}
                placeholder="example.com"
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <Button type="submit" size="sm" className="px-3"
            onClick={getRemoteCertificates}>
            <span className="sr-only">Proceed</span>
            <ArrowBigRight className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
