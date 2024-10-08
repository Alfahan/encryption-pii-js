const { createCipheriv, createDecipheriv } = require('crypto');
const { Buffer } = require('buffer');
const { AES_128_CBC } = require('./alg');
const { AES_192_CBC } = require('./alg');
const { AES_256_CBC } = require('./alg');
const { AES_128_GCM } = require('./alg');
const { AES_192_GCM } = require('./alg');
const { AES_256_GCM } = require('./alg');
const { AES_128_CCM } = require('./alg');
const { AES_192_CCM } = require('./alg');
const { AES_256_CCM } = require('./alg');
const { AES_128_OCB } = require('./alg');
const { AES_192_OCB } = require('./alg');
const { AES_256_OCB } = require('./alg');
const { generateRandomIV } = require('./key_utils');
const AesCipher = require('./type');
require('dotenv').config();

const DEFAULT_AUTH_TAG_LENGTH = 16;
const SUPPORTED_AUTH_TAG_MODES = ['gcm', 'ccm', 'ocb', 'chacha20-poly1305'];

/**
 * @param alg {string}
 * @return {{mode: *, ivLen: (number), expectedKeyLen: number}}
 */
const getMetaFromAlgorithm = (alg) => {
    const algSplited = alg.split('-');
    if (algSplited.length < 3) {
        throw new Error('invalid aes algorithm');
    }

    const keyLenInt = parseInt(algSplited[1], 10);
    const ivLen = algSplited[2] === 'cbc' ? 16 : 12;
    return { expectedKeyLen: keyLenInt / 8, mode: algSplited[2], ivLen };
};

/**
 * @param alg {string}
 * @param key {string}
 * @param data {string | Buffer}
 * @return {{encrypted: string, nonce}}
 */
const encrypt = (alg, key, data) => {
    const metaAlg = getMetaFromAlgorithm(alg);
    if (key.length !== metaAlg.expectedKeyLen) {
        throw new Error(`invalid key length, key length should be ${metaAlg.expectedKeyLen}`);
    }

    const nonce = generateRandomIV(metaAlg.ivLen);
    const nonceBuf = Buffer.from(nonce, 'hex');
    
    const keyBuf = Buffer.from(key);
    
    const cipherOptions = {
        authTagLength: DEFAULT_AUTH_TAG_LENGTH,
    };
    
    const cipher = createCipheriv(alg, keyBuf, nonceBuf, cipherOptions);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    // https://nodejs.org/api/crypto.html#ciphergetauthtag
    if (SUPPORTED_AUTH_TAG_MODES.includes(metaAlg.mode)) {
        encrypted += Buffer.from(cipher.getAuthTag().toString('hex'));
    }

    return Buffer.concat([nonceBuf, Buffer.from(encrypted, 'hex')], nonceBuf.length + Buffer.from(encrypted, 'hex').length);
};

/**
 * @param alg {string}
 * @param key {string}
 * @param data {string | Buffer}
 * @return {Buffer}
 */
const decrypt = (alg, key, data) => {
    if (typeof data !== 'object' && typeof data !== 'string') {
        throw new Error('error: data param should be object');
    }

    const metaAlg = getMetaFromAlgorithm(alg);
    if (key.length !== metaAlg.expectedKeyLen) {
        throw new Error(`invalid key length, key length should be ${metaAlg.expectedKeyLen}`);
    }

    const keyBuf = Buffer.from(key);

    const cipherOptions = {
        authTagLength: DEFAULT_AUTH_TAG_LENGTH,
    };

    const buf = Buffer.from(data, 'hex');
    const nonceBuf = buf.subarray(0, metaAlg.ivLen);

    const decipher = createDecipheriv(alg, keyBuf, nonceBuf, cipherOptions);

    let encryptedBuf;
    // https://nodejs.org/api/crypto.html#deciphersetauthtag
    if (SUPPORTED_AUTH_TAG_MODES.includes(metaAlg.mode)) {
        const sFrom = buf.length - DEFAULT_AUTH_TAG_LENGTH;
        const authTagUtf8 = buf.subarray(sFrom, buf.length);
        decipher.setAuthTag(authTagUtf8);
        encryptedBuf = buf.subarray(metaAlg.ivLen, sFrom);
    } else {
        encryptedBuf = buf.subarray(metaAlg.ivLen, buf.length);
    }

    let decrypted = decipher.update(encryptedBuf);
    let remaining = decipher.final();

    return Buffer.concat([decrypted, remaining], decrypted.length + remaining.length);
};

exports.encryptWithAes = (type, data) => {
    const key = process.env.CRYPTO_AES_KEY;
    let encryptValue = null;
    switch (type) {
        case 'AES_128_CBC':
			encryptValue = encrypt(AES_128_CBC, key, data);
			break;
		case 'AES_192_CBC':
			encryptValue = encrypt(AES_192_CBC, key, data);
			break;
		case 'AES_256_CBC':
			encryptValue = encrypt(AES_256_CBC, key, data);
			break;
		case 'AES_128_GCM':
			encryptValue = encrypt(AES_128_GCM, key, data);
			break;
		case 'AES_192_GCM':
			encryptValue = encrypt(AES_192_GCM, key, data);
			break;
		case 'AES_256_GCM':
			encryptValue = encrypt(AES_256_GCM, key, data);
			break;
		case 'AES_128_CCM':
			encryptValue = encrypt(AES_128_CCM, key, data);
			break;
		case 'AES_192_CCM':
			encryptValue = encrypt(AES_192_CCM, key, data);
			break;
		case 'AES_256_CCM':
			encryptValue = encrypt(AES_256_CCM, key, data);
			break;
		case 'AES_128_OCB':
			encryptValue = encrypt(AES_128_OCB, key, data);
			break;
		case 'AES_192_OCB':
			encryptValue = encrypt(AES_192_OCB, key, data);
			break;
		case 'AES_256_OCB':
			encryptValue = encrypt(AES_256_OCB, key, data);
			break;
		default:
			throw new Error('Unsupported encryption type');
    }

    let cipher = new AesCipher();
    cipher.Value = encryptValue;
    cipher.To = data.toString();

    return cipher;
}

exports.decryptWithAes = (type, data) => {
    const key = process.env.CRYPTO_AES_KEY;
    let decryptValue = null;
    switch (type) {
		case 'AES_128_CBC':
			decryptValue = decrypt(AES_128_CBC, key, data);
			break;
		case 'AES_192_CBC':
			decryptValue = decrypt(AES_192_CBC, key, data);
			break;
		case 'AES_256_CBC':
			decryptValue = decrypt(AES_256_CBC, key, data);
			break;
		case 'AES_128_GCM':
			decryptValue = decrypt(AES_128_GCM, key, data);
			break;
		case 'AES_192_GCM':
			decryptValue = decrypt(AES_192_GCM, key, data);
			break;
		case 'AES_256_GCM':
			decryptValue = decrypt(AES_256_GCM, key, data);
            break;
		case 'AES_128_CCM':
			decryptValue = decrypt(AES_128_CCM, key, data);
            break;
		case 'AES_192_CCM':
			decryptValue = decrypt(AES_192_CCM, key, data);
			break;
		case 'AES_256_CCM':
			decryptValue = decrypt(AES_256_CCM, key, data);
			break;
		case 'AES_128_OCB':
			decryptValue = decrypt(AES_128_OCB, key, data);
			break;
		case 'AES_192_OCB':
			decryptValue = decrypt(AES_192_OCB, key, data);
			break;
		case 'AES_256_OCB':
			decryptValue = decrypt(AES_256_OCB, key, data);
			break;
		default:
			throw new Error('Unsupported decryption type');
	}

	return decryptValue.toString();

}