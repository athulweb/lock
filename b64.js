// Base64 Toolkit by Rootzero

const b64 = {
  toBytes: text => new TextEncoder().encode(text),
  toText: bytes => new TextDecoder().decode(bytes),

  encodeBytes: bytes => {
    let bin = "";
    for (let b of bytes) bin += String.fromCharCode(b);
    return btoa(bin);
  },

  decodeBase64: b64str => {
    const bin = atob(b64str);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
      bytes[i] = bin.charCodeAt(i);
    }
    return bytes;
  },

  encodeText: str => btoa(unescape(encodeURIComponent(str))),
  decodeText: b64str => decodeURIComponent(escape(atob(b64str)))
};
