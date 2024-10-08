const CryptoJs = require('../index');
const { UserMetadata, User } = require('./schema/user');

// Fungsi untuk menyimpan user
const createUser = async (userData) => {
    const encryptedUser = {
        name: userData.name,
        email: CryptoJs.encryptWithAes('AES_256_CBC', userData.email), // Enkripsi menggunakan AES
        phone: CryptoJs.encryptWithAes('AES_256_CBC', userData.phone), // Enkripsi nomor telepon
        nik: CryptoJs.encryptWithAes('AES_256_CBC',userData.nik), // Enkripsi NIK
    };

    // Bangun blind index untuk user tersebut
    const blindIndexData = await CryptoJs.buildBlindIndex(UserMetadata, encryptedUser);
    encryptedUser.blindIndexes = blindIndexData;

    // return encryptedUser;
    // Simpan ke database
    // await encryptedUser.save();
    console.log(encryptedUser);
    console.log('User saved with encrypted data and blind index');
};

// Contoh penggunaan
createUser({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '081234567890',
    nik: '1234567890123456',
});
