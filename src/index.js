const { encryptWithAes, decryptWithAes } = require("./crypto-js/lib/aes_encryption");
const { buildBlindIndex, searchContents, buildHeap } = require("./crypto-js/lib/query");
const AesCipher = require("./crypto-js/lib/type");

const CryptoJs = {
    encryptWithAes,
    decryptWithAes,
    buildBlindIndex,
    searchContents,
    buildHeap,
    AesCipher,
}

module.exports = CryptoJs;