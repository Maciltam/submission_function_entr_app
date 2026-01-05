const { uploadFile } = require("./uploadFile");
const { createRow } = require("./createRow.js");
const { verifyCode } = require("./verifyCode.js");

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

const processFunction = async ({ req, res, log }) => {
  const { table_data, files, personal_code, application_type } = req.bodyJson;
  const { candidate1, candidate2 } = files;
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { candidate1_mail } = table_data;
  log(candidate1_mail);
  const verified = await verifyCode({ candidate1_mail, personal_code });
  if (!verified) {
    log("unverified");
    throw new Error("unregistered");
  }

  try {
    //check code + email function
    //if invalid throw error with invalid code
    const { c1, c2 } = await composeUploads({ candidate1, candidate2 });
    const row = prepareRow(table_data, { c1, c2 });
    await createRow(row);
    return res.text(JSON.stringify({ status: "success" }));
  } catch (err) {
    //Add cleanup logic
    if (err.message == "unregistered") {
      return res.text(JSON.stringify({ status: "unregistered" }));
    } else {
      log(err.message);
      return res.text(JSON.stringify({ status: "internal error: " + err }));
    }
  }
};

module.exports = processFunction;
