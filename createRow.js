const { Storage, Databases, Client, ID } = require("node-appwrite");
const { InputFile } = require("node-appwrite/file");
require("dotenv").config();

const createRow = async (data) => {
  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.PROJECT_ID)
    .setKey(process.env.KEY);

  const databaseInterface = new Databases(client);
  const dbId = process.env.USERS_DB_ID;
  const collectionId = process.env.USERS_COLLECTION_ID;

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
