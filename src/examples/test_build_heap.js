const CryptoJs = require('../index');
const { UserMetadata, User } = require('./schema/user');

// Fungsi untuk menyimpan user
const createUser = async (userData) => {
    // Bangun blind index untuk user tersebut
    const email = await CryptoJs.buildHeap(userData.email);
    const phone = await CryptoJs.buildHeap(userData.phone);
    const nik = await CryptoJs.buildHeap(userData.nik);

    console.log(email);
    console.log(phone);
    console.log(nik);
};

// Contoh penggunaan
createUser({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '081234567890',
    nik: '3215012306970009',
});
