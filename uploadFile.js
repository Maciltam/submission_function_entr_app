const { InputFile } = require("node-appwrite/file");
const { Client, Storage, ID } = require("node-appwrite");

const uploadFile = async ({ content, name }, bucketId) => {
  const buffer = Buffer.from(content, "base64");
  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.PROJECT_ID)
    .setKey(process.env.KEY);
  const storage = new Storage(client);
  try {
    const response = await storage.createFile(
      bucketId,
      ID.unique(),
      InputFile.fromBuffer(buffer, name),
    );
    return response;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { uploadFile };
