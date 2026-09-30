const { default: ImageKit, toFile } = require("@imagekit/nodejs");

let imageKitClient;

const getImageKitClient = () => {
  if (!process.env.IMAGEKIT_PRIVATE_KEY) {
    const error = new Error("ImageKit is not configured");
    error.code = "IMAGEKIT_NOT_CONFIGURED";
    throw error;
  }

  if (!imageKitClient) {
    imageKitClient = new ImageKit({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    });
  }

  return imageKitClient;
};

const uploadToImageKit = async (fileBuffer, fileName, userId) => {
  const client = getImageKitClient();
  const uploadResult = await client.files.upload({
    file: await toFile(fileBuffer, fileName),
    fileName,
    folder: `/photo-gallery/users/${userId}`,
    useUniqueFileName: true,
  });

  if (!uploadResult.fileId || !uploadResult.url) {
    throw new Error("ImageKit returned incomplete upload details");
  }

  return {
    fileUrl: uploadResult.url,
    imageKitFileId: uploadResult.fileId,
  };
};

const deleteFromImageKit = async (fileId) => {
  const client = getImageKitClient();
  await client.files.delete(fileId);
};

module.exports = {
  uploadToImageKit,
  deleteFromImageKit,
};
