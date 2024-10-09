// src/session.ts
import Store from 'electron-store';

interface UserSession {
  email: string;
}

const store = new Store<UserSession>();

export const saveUserSession = (email: string): void => {
  store.set('email', email);
};

export const getUserSession = (): string | undefined => {
  return store.get('email');
};

export const clearUserSession = (): void => {
  store.delete('email');
};