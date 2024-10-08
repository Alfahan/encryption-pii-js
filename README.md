# AGENT PII (Javascript)

## API Client
- [x] `encryptWithAes`
- [x] `decryptWithAes`
- [x] `buildHeap`
- [x] `AesCipher`
- [ ] `buildBlindIndex`
- [ ] `searchContents`
- [ ] `searchContentFullText`

## Installation this package to your project

1. Run `npm` or `yarn` to install:
    ```
    npm i pii-agent-js
    ```

2. Set the keys in your `.env` file:
    ```
	CRYPTO_AES_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
	CRYPTO_HMAC_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

## Usage Examples

### Test Encrypt and Decrypt
```javascript
const CryptoJs = require('../index')

const data = 'Mohamad Ali Farhan'

// encrypt
const encryptedHex = CryptoJs.encryptWithAes('AES_256_CBC', data);
console.log('Encrypted Data (Hex):', encryptedHex);

// decrypt
const decryptedData = CryptoJs.decryptWithAes('AES_256_CBC', encryptedHex.Value);
console.log('Decrypt Data:', decryptedData);

```

### Test Build Heap

```javascript
const CryptoJs = require('../index');

const createUser = async (userData) => {
    const email = await CryptoJs.buildHeap(userData.email);
    const phone = await CryptoJs.buildHeap(userData.phone);
    const nik = await CryptoJs.buildHeap(userData.nik);

    console.log(email);
    console.log(phone);
    console.log(nik);
};

createUser({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '081234567890',
    nik: '3215012306970009',
});
```


## Change Log

See [Changelog](CHANGELOG.md) for more information.

## Contributing

Contributions are welcome! See [Contributing](CONTRIBUTING.md).

## Author

- Khaerul A ([Github](https://github.com/kadzany))
- M Ali Farhan ([Github](https://github.com/Alfahan))

## License

Licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---