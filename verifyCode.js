const { Databases, Client } = require("node-appwrite");

const verifyCode = async ({ candidate1_mail, personal_code }) => {
  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.PROJECT_ID)
    .setKey(process.env.KEY);

  const databaseInterface = new Databases(client);
  const dbId = process.env.CODES_DB_ID;
  const collectionId = process.env.CODES_COLLECTION_ID;

  let codes = await databaseInterface.listDocuments(dbId, collectionId, []);
  codes = codes.documents.map(({ email, code }) => ({ email, code }));

  const found = codes.find(
    (elt) => elt.email == candidate1_mail && elt.code == personal_code,
  );

  return Boolean(found);
};

module.exports = { verifyCode };
