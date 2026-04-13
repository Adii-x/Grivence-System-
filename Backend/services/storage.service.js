const ImageKit = require("@imagekit/nodejs");

const uploadToImageKit = async (file) => {
    if (!file) return null;

    const imagekit = new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });

    // ImageKit expects a binary/base64 payload. We convert buffer to base64 explicitly.
    const base64File = file.buffer.toString("base64");

    const response = await imagekit.files.upload({
        file: base64File,
        fileName: file.originalname,
        folder: "Nexus",
    });

    return response.url;
};

module.exports = { uploadToImageKit };