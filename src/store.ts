import { create } from "zustand";
import { Certificate } from "./types/Certificate";

interface UserState {
  email: string;
  token: string;
  setEmail: (email: string) => void;
  globalNotification: number;
  setGlobalNotification: (globalNotification: number) => void;
}

const useUserStore = create<UserState>()((set) => ({
  email: "",
  token: "",
  setEmail: (email: string) => {
    set({ email });
  },
  globalNotification: 0,
  setGlobalNotification: (globalNotification: number) => {
    set({ globalNotification });
  },
}));

interface CertificateState {
  certificates: Certificate[];
  setCertificates: (certificates: Certificate[]) => void;
  notifications: any;
  setNotifications: (notifications: any) => void;
  remoteCertificates: any;
  setRemoteCertificates: (remoteCertificates: any) => void;
}
const useCertificateStore = create<CertificateState>((set) => ({
  certificates: [],
  setCertificates: (certificates: Certificate[]) => set({ certificates }),
  notifications: [],
  setNotifications: (notifications: any) => set({ notifications }),
  remoteCertificates: [],
  setRemoteCertificates: (remoteCertificates: any) => set({ remoteCertificates }),
}));

export { useUserStore, useCertificateStore };
