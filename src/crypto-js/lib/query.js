require('reflect-metadata');
const dotenv = require('dotenv');
const { commonGenerateDigest } = require('./hmac');
const { dt_conf } = require('./config');
const AesCipher = require('./type');
const { parsePhone, isValidPhone, phoneToString } = require('../validate/phone');
const { isValidNIK, parseNIK, nikToString } = require('../validate/nik');
const { isValidNPWP, parseNPWP, npwpToString } = require('../validate/npwp');
dotenv.config();

const getMetadata = (entity, key, metaKey) => {
    const metadata = Reflect.getMetadata(metaKey, entity, key);
    if (!metadata) {
        throw new Error(`No metadata found for key: ${key}, metaKey: ${metaKey}`);
    }
    return metadata;
};

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
        heaps.push({ content: val.toLowerCase(), type: typeHeap, hash: hash8LastChar });
    });

    return { str: Array.from(builder).join(' '), heaps };
};

const saveToHeap = async (textHeaps) => {
    const dt = await dt_conf();

    // Group textHeaps by type
    const textHeapsByType = textHeaps.reduce((acc, th) => {
        if (!acc[th.type]) {
            acc[th.type] = [];
        }
        acc[th.type].push(th);
        return acc;
    }, {});

    // Iterate over each group and perform the operations
    for (const type in textHeapsByType) {
        const group = textHeapsByType[type];

        // Extract all hashes from the current group
        const hashes = group.map(th => th.hash);

        // Check existence of all hashes
        const existingHashes = await dt.collection(type).find({ hash: { $in: hashes } }).toArray();

        const existingHashSet = new Set(existingHashes.map(doc => doc.hash));

        // Filter out textHeaps that already exist
        const newTextHeaps = group.filter(th => !existingHashSet.has(th.hash));

        if (newTextHeaps.length > 0) {
            // Perform bulk insert
            await dt.collection(type).insertMany(newTextHeaps);
        }
    }
};

// SearchContents
const searchContents = async (table, args) => {
    const dt = await dt_conf();
    const result = await dt.collection(table).find({ content: { $regex: new RegExp(args.content, 'i') } }).toArray();

    return result.map(row => ({
        id: row._id,
        content: row.content,
        hash: row.hash,
    }));
};

// SearchContentFullText
const searchContentFullText = async (table, args) => {
    const dt = await dt_conf();
    const result = await dt.collection(table).find({ content: { $in: args.contents } }).toArray();

    const sortedResult = args.contents.map(content => {
        const row = result.find(r => r.content === content);
        return row
            ? {
                id: row._id,
                content: row.content,
                hash: row.hash,
            }
            : null;
    }).filter(Boolean);

    return sortedResult;
};

const buildBlindIndex = async (entityMetadata, entity) => {
    const th = [];
    const result = {};

    for (const key in entityMetadata) {
        if (entityMetadata.hasOwnProperty(key)) {
            const metadata = entityMetadata[key];
            const value = entity[key];
            if (value instanceof AesCipher) {
                const encryptWithAesBuf = value.Value;

                result[metadata.db] = encryptWithAesBuf;

                const txtHeapTable = metadata.txt_heap_table;
                if (txtHeapTable) {
                    const { str, heaps } = buildHeap(value.To.toString(), txtHeapTable);
                    th.push(...heaps);

                    result[metadata.bidx_col] = str;
                }
            } else {
                result[metadata.db] = value;
            }
        }
    }

    return th;
};


module.exports = {
    split,
    getLast8Characters,
    validateEmail,
    buildHeap,
    saveToHeap,
    searchContents,
    searchContentFullText,
    buildBlindIndex,
};
