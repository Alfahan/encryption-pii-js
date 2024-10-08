const { createHmac } = require('crypto');
const alg = require('./alg');
const dotenv = require('dotenv');
const { checkKeyInput } = require('./key_utils');

dotenv.config();

/**
 * HMAC digest
 * @param {string} algorithm
 * @param {string | Buffer} key
 * @param {Array.<string | Buffer>} datas
 * @returns {string}
 */
const digest = (algorithm, key, datas) => {
    const hmac = createHmac(algorithm, key);
    for (const data of datas) {
        hmac.update(data.toString());
    }

    return hmac.digest('hex');
};

/**
 * 
 * @param {string} algorithm
 * @param {...(string | Buffer)} datas
 * @returns {string}
 */
const commonGenerateDigest = (algorithm, ...datas) => {
    const key = process.env.CRYPTO_HMAC_KEY;
    checkKeyInput(key);

    switch (algorithm.toUpperCase()) {
        case 'MD5':
            return digest(alg.MD5_DIGEST, key, datas);
        case 'SHA1':
            return digest(alg.SHA1_DIGEST, key, datas);
        case 'SHA256':
            return digest(alg.SHA256_DIGEST, key, datas);
        case 'SHA384':
            return digest(alg.SHA384_DIGEST, key, datas);
        case 'SHA512':
            return digest(alg.SHA512_DIGEST, key, datas);
        default:
            throw new Error(`Unsupported algorithm: ${algorithm}`);
    }
};

module.exports = { commonGenerateDigest };
