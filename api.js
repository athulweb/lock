// AES Encryption Engine by Rootzero

const LATEST_API_VERSION = "0.0.1";
const apiVersions = {};

apiVersions["0.0.1"] = {
  defaultSalt: Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]),
  defaultIV: Uint8Array.from([16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5]),

  getSalt: async () => crypto.getRandomValues(new Uint8Array(16)),
  getIV: async () => crypto.getRandomValues(new Uint8Array(12)),

  deriveKey: async function (password, salt = null) {
    const baseKey = await crypto.subtle.importKey(
      "raw",
      b64.toBytes(password),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );

    return await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt || this.defaultSalt,
        iterations: 100000,
        hash: "SHA-256"
      },
      baseKey,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
  },

  encrypt: async function (text, password, salt = null, iv = null) {
    const key = await this.deriveKey(password, salt);
    return await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv || this.defaultIV },
      key,
      b64.toBytes(text)
    );
  },

  decrypt: async function (buffer, password, salt = null, iv = null) {
    const key = await this.deriveKey(password, salt);
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv || this.defaultIV },
      key,
      new Uint8Array(buffer)
    );
    return b64.toText(decrypted);
  }
};
