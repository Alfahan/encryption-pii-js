const PHONE_REGEX = /^(?:\+?(\d{1,3}))?(\d{2})(\d{4,10})$/;
const PHONE_MIN_LENGTH = 10;
const PHONE_MAX_LENGTH = 12;

const parsePhone = (v) => {
    if (typeof v === 'string') {
        if (!isValidPhone(v)) {
            throw new Error(`invalid data phone ${v}`);
        }
        return { v };
    } else {
        throw new Error(`invalid type ${typeof v}`);
    }
};

const getPhoneValue = async (phone) => {
    return phone.v;
};

const phoneToString = (phone) => {
    const validPhone = (PHONE_REGEX.exec(numbersOnly(phone.v)) || []).slice(1);
    return validPhone.join('-');
};

const phoneToStringP = async (phone) => {
    const validPhone = (PHONE_REGEX.exec(numbersOnly(phone.v)) || []).slice(1);
    return validPhone.length ? validPhone.join('-') : null;
};

const phoneToSlice = async (phone) => {
    return (PHONE_REGEX.exec(numbersOnly(phone.v)) || []).slice(1);
};

const isValidPhone = (phone) => {
    const cleanNumber = phone.replace(/[- ]/g, '');

    if (!PHONE_REGEX.test(cleanNumber)) return false;

    const validPhone = (PHONE_REGEX.exec(numbersOnly(cleanNumber)) || []);
    if (!validPhone.length) return false;

    return correctLength(validPhone[0].length, PHONE_MIN_LENGTH, PHONE_MAX_LENGTH);
};

const numbersOnly = (v) => {
    return v.replace(/\D/g, '');
};

const correctLength = (length, minLength, maxLength) => {
    return length >= minLength && length <= maxLength;
};

module.exports = {
    parsePhone,
    getPhoneValue,
    phoneToString,
    phoneToStringP,
    phoneToSlice,
    isValidPhone,
    numbersOnly,
    correctLength
};
