export interface CertificateDTO {
    Subject: string;
    Issuer: string;
    Thumbprint?: string;
    FriendlyName?: string;
    NotBefore: string;
    NotAfter: string;
    Extensions?: string;
    notifyBefore?: number;
    remote?: boolean;
  }
export interface Certificate extends CertificateDTO {
    timeRemaining: number | null;
  }