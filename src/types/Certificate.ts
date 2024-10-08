export interface CertificateDTO {
    Subject: string;
    Issuer: string;
    Thumbprint: string;
    FriendlyName: string;
    NotBefore: string;
    NotAfter: string;
    Extensions: string;
  }
export interface Certificate extends CertificateDTO {
    timeRemaining: number | null;
  }