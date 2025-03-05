export async function toCrypted(key: CryptoKey, data: string, ) {
    const encodedData = new TextEncoder().encode(data);
    
    const encrypted = await window.crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      key,
      encodedData
    );
  
    return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
}
  
export async function importPublicKey(pemKey: string): Promise<CryptoKey> {
  const keyBody = pemKey.replace(/-----(BEGIN|END) PUBLIC KEY-----|\s+/g, "").trim();
  
  const binaryKey = window.atob(keyBody); 
  const keyBuffer = new Uint8Array(binaryKey.length);
  for (let i = 0; i < binaryKey.length; i++) {
    keyBuffer[i] = binaryKey.charCodeAt(i);
  }

  return await window.crypto.subtle.importKey(
    "spki", 
    keyBuffer.buffer,
    { name: "RSA-OAEP", hash: "SHA-256" },
    true, 
    ["encrypt"]
  );
}

