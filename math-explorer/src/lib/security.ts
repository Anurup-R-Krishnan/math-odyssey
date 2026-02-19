const ENCRYPTION_KEY = "neuromath-secure-key-v1";

export function encryptData(data: any): string {
  try {
    const jsonString = JSON.stringify(data);
    const textEncoder = new TextEncoder();
    const encodedData = textEncoder.encode(jsonString); // Uint8Array

    // XOR with key
    const keyBytes = textEncoder.encode(ENCRYPTION_KEY);
    const encryptedBytes = new Uint8Array(encodedData.length);
    for (let i = 0; i < encodedData.length; i++) {
      encryptedBytes[i] = encodedData[i] ^ keyBytes[i % keyBytes.length];
    }

    // Convert Uint8Array to Base64 string safely
    let binary = '';
    const len = encryptedBytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(encryptedBytes[i]);
    }
    return window.btoa(binary);

  } catch (e) {
    console.error("Encryption failed", e);
    return "";
  }
}

export function decryptData<T>(encrypted: string | null): T | null {
  if (!encrypted) return null;
  try {
    // Attempt to decrypt
    const binary = window.atob(encrypted);
    const encryptedBytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        encryptedBytes[i] = binary.charCodeAt(i);
    }

    const textEncoder = new TextEncoder();
    const keyBytes = textEncoder.encode(ENCRYPTION_KEY);

    const decryptedBytes = new Uint8Array(encryptedBytes.length);
    for (let i = 0; i < encryptedBytes.length; i++) {
      decryptedBytes[i] = encryptedBytes[i] ^ keyBytes[i % keyBytes.length];
    }

    const textDecoder = new TextDecoder();
    const jsonString = textDecoder.decode(decryptedBytes);
    return JSON.parse(jsonString) as T;
  } catch (e) {
    // Fallback: try to parse as plain JSON (for backward compatibility)
    try {
        return JSON.parse(encrypted) as T;
    } catch (e2) {
        // Quietly fail for normal operation, but log if debugging needed
        // console.error("Decryption failed and fallback failed", e);
        return null;
    }
  }
}
