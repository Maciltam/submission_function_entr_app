const { Storage, Databases, Client, ID } = require("node-appwrite");
const { InputFile } = require("node-appwrite/file");

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.PROJECT_ID)
  .setKey(process.env.KEY);

const databaseInterface = new Databases(client);
const dbId = process.env.DB_ID;
const collectionId = process.env.COLLECTION_ID;

const createRow = async (data) => {
  try {
    const response = await databaseInterface.createDocument(
      dbId,
      collectionId,
      ID.unique(),
      data,
    );
    return response;
  } catch (err) {
    throw err;
  }
};

module.exports = { createRow };
