const { uploadFile } = require("./uploadFile");
const { createRow } = require("./createRow.js");

const testObject = {
  key1: "value1",
  key2: "value2",
  key3: "value3",
};

const composeUploads = async ({ candidate1, candidate2 }) => {
  const photoBucket = process.env.BUCKET_ID;
  const cvBucket = process.env.BUCKET_ID;
  let c1 = { photo: null, cv: null };
  let c2 = { photo: null, cv: null };
  //Upload cv1 and photo1
  const cv1Response = await uploadFile(candidate1.cv, cvBucket);
  c1.cv = cv1Response.$id;
  const photo1Response = await uploadFile(candidate1.photo, photoBucket);
  c1.photo = photo1Response.$id;
  if (candidate2.photo) {
    //Upload cv2 and photo2
    const cv2Response = await uploadFile(candidate2.cv, cvBucket);
    c2.cv = cv2Response.$id;
    const photo2Response = await uploadFile(candidate2.photo, photoBucket);
    c2.photo = photo2Response.$id;
  }
  return {
    c1,
    c2,
  };
};

const prepareRow = (receivedData, { c1, c2 }) => {
  receivedData.candidate1_photo_id = c1.photo;
  receivedData.candidate1_cv_id = c1.cv;
  receivedData.candidate2_photo_id = c2.photo;
  receivedData.candidate2_cv_id = c2.cv;
  return receivedData;
};

const testString = JSON.stringify(testObject);

const testBuffer = Buffer.from(testString, "utf-8");

const mockupRequest = {
  body: {
    tableData: {
      candidate1_name: "John Doe",
      candidate2_name: "John Doe",
      department: "Automatique",
      short_description: "Short description",
      long_description: "Long description",
    },
    files: {
      candidate1: {
        photo: testBuffer,
        cv: testBuffer,
      },
      candidate2: {
        photo: testBuffer,
        cv: testBuffer,
      },
    },
  },
};

const processFunction = async ({ req, res, log }) => {
  const { tableData, files } = req.bodyJson;
  const { candidate1, candidate2 } = files;
  log(candidate1);

  const { c1, c2 } = await composeUploads({ candidate1, candidate2 });
  const row = prepareRow(tableData, { c1, c2 });
  const uploadResponse = await createRow(row);

  return res.text(JSON.stringify({ status: "sucees" }));
};

module.exports = processFunction;
