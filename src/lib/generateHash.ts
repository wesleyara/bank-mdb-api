import { AES, enc } from "crypto-js";

export const generateHash = (password: string, secret: string): string => {
  const hash = AES.encrypt(password, secret);
  return hash.toString();
};

export const decryptHash = (hash: string, secret: string): string => {
  const decrypted = AES.decrypt(hash, secret);

  return decrypted.toString(enc.Utf8);
};
