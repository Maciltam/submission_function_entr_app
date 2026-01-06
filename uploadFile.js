const { InputFile } = require("node-appwrite/file");
const { Client, Storage, ID } = require("node-appwrite");

const uploadFile = async ({ content, name }, bucketId) => {
  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.PROJECT_ID)
    .setKey(process.env.KEY);
  const storageInterface = new Storage(client);
  try {
    const response = await storageInterface.createFile(
      bucketId,
      ID.unique(),
      InputFile.fromBuffer(content, name),
    );
    return response;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { uploadFile };
