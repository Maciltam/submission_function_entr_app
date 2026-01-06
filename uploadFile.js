const { InputFile } = require("node-appwrite/file");
const { Client, Storage, ID } = require("node-appwrite");

const uploadFile = async ({ content, name }, bucketId) => {
  const buffer = Buffer.from(content, "base64");
  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.PROJECT_ID)
    .setKey(process.env.KEY);
  const storageInterface = new Storage(client);
  try {
    const response = await storageInterface.createFile(
      bucketId,
      ID.unique(),
      buffer,
      name,
    );
    return response;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { uploadFile };
