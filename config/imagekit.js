require('dotenv').config();
const ImageKit = require('imagekit');

const publicKey = process.env.IMAGEKIT_PUBLIC_KEY ? process.env.IMAGEKIT_PUBLIC_KEY.trim() : '';
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY ? process.env.IMAGEKIT_PRIVATE_KEY.trim() : '';
const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT ? process.env.IMAGEKIT_URL_ENDPOINT.trim() : '';

// Terminal එකේ Keys load වෙනවාදැයි පරීක්ෂා කිරීම
console.log('--- ImageKit Credentials Check ---');
console.log('Public Key Loaded:', publicKey ? '✅ YES' : '❌ NO');
console.log('Private Key Loaded:', privateKey ? '✅ YES' : '❌ NO');
console.log('URL Endpoint Loaded:', urlEndpoint ? '✅ YES' : '❌ NO');
console.log('----------------------------------');

const imagekit = new ImageKit({
  publicKey: publicKey,
  privateKey: privateKey,
  urlEndpoint: urlEndpoint
});

module.exports = imagekit;