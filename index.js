const { encryptWithAes, decryptWithAes } = require("./src/crypto-js/lib/aes_encryption");
const { buildHeap } = require("./src/crypto-js/lib/query");
const AesCipher = require("./src/crypto-js/lib/type");

const CryptoJs = {
    encryptWithAes,
    decryptWithAes,
    buildHeap,
    AesCipher,
}

module.exports = CryptoJs;