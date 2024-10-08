
const dotenv = require('dotenv');
const { commonGenerateDigest } = require('./hmac');
const { parsePhone, isValidPhone, phoneToString } = require('../validate/phone');
const { isValidNIK, parseNIK, nikToString } = require('../validate/nik');
const { isValidNPWP, parseNPWP, npwpToString } = require('../validate/npwp');
dotenv.config();

const split = (value) => {
    let sep = ' ';
    const reg = '[a-zA-Z0-9]+';
    const regex = new RegExp(reg, 'g');

    if (isValidPhone(value)) {
        const parsedPhone = parsePhone(value);
        const phoneStr = phoneToString(parsedPhone);
        sep = '-';
        value = phoneStr;
    } else if (isValidNIK(value)) {
        const parseNik = parseNIK(value);
        const nikStr = nikToString(parseNik);
        sep = '.';
        value = nikStr;
    } else if (isValidNPWP(value)) {
        const parseNpwp = parseNPWP(value);
        const npwpStr = npwpToString(parseNpwp);
        sep = '.';
        value = npwpStr;
    } else if (validateEmail(value)) {
        sep = '@';
    }

    const parts = value.split(sep);
    const result = parts.flatMap(part => part.match(regex) || []);

    return result;
};

const getLast8Characters = (input) => {
    if (input.length <= 8) {
        return input;
    }
    return input.slice(-8);
};

const validateEmail = (email) => {
    const emailRegexPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegexPattern.test(email);
};

const buildHeap = (value, typeHeap) => {
    const values = split(value);
    const builder = new Set();
    const heaps = [];

    values.forEach(val => {
        const hash = commonGenerateDigest('SHA256', val);
        const hash8LastChar = getLast8Characters(hash);
        builder.add(hash8LastChar);
        heaps.push({ content: val.toLowerCase(), hash: hash8LastChar });
    });

    return { str: Array.from(builder).join(' '), heaps };
};

module.exports = {
    split,
    getLast8Characters,
    validateEmail,
    buildHeap,
};
