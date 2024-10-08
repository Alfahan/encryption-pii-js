const { default: mongoose } = require("mongoose");
const CryptoJs = require("../../index");

const UserMetadata = {
    email: {
        db: 'email',
        bidx_col: 'email_bidx',
        txt_heap_table: 'user_txt_heap',
        encrypted: true,
    },
    phone: {
        db: 'phone',
        bidx_col: 'phone_bidx',
        txt_heap_table: 'user_phone_heap',
        encrypted: false,
    },
    nik: {
        db: 'nik',
        bidx_col: 'nik_bidx',
        txt_heap_table: 'user_nik_heap',
        encrypted: true,
    },
};

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        index: true
    },
    phone: {
        type: String,
        required: true,
        index: true
    },
    nik: {
        type: String,
        required: true,
        index: true
    },
    blindIndexes: {
        email_bidx: String, // Blind index untuk email
        phone_bidx: String, // Blind index untuk phone
        nik_bidx: String, // Blind index untuk NIK
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = {
    User,
    UserMetadata
};