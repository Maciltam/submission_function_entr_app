const { InputFile } = require("node-appwrite/file");
const { Client, Storage, ID } = require("node-appwrite");
const dotenv = require("dotenv");
dotenv.config();

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.PROJECT_ID)
  .setKey(process.env.KEY);
const storageInterface = new Storage(client);

const uploadFile = async (buffer, bucketId) => {
  try {
    const response = await storageInterface.createFile(
      bucketId,
      ID.unique(),
      InputFile.fromBuffer(buffer, ID.unique()),
    );
    return response;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { uploadFile };
