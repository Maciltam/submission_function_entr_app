const { Databases, Client, Query } = require("node-appwrite");
const bcrypt = require("bcrypt");

const verifyCode = async ({ candidate1_mail, personal_code }) => {
  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.PROJECT_ID)
    .setKey(process.env.KEY);

  const databaseInterface = new Databases(client);
  const dbId = process.env.CODES_DB_ID;
  const collectionId = process.env.CODES_COLLECTION_ID;

  let codes = await databaseInterface.listDocuments({
    databaseId: dbId,
    collectionId: collectionId,
    queries: [Query.equal("email", candidate1_mail)],
  });

  codes = codes.documents.map(({ email, code }) => ({ email, code }));

  const found = codes.find((elt) => elt.email == candidate1_mail);
  console.log("provided code: ", personal_code);

  console.log("found: ", found);

  try {
    const correspondence = await bcrypt.compare(personal_code, found.code);
    return correspondence;
  } catch {
    return false;
  }
};

module.exports = { verifyCode };
