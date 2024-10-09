const CryptoJs = require('../../index')

const data = 'Mohamad Ali Farhan'

// encrypt
const encryptedHex = CryptoJs.encryptWithAes('AES_256_CBC', data);
console.log('Encrypted Data (Hex):', encryptedHex);

// decrypt
const decryptedData = CryptoJs.decryptWithAes('AES_256_CBC', encryptedHex.Value);
console.log('Decrypt Data:', decryptedData);
