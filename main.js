const { uploadFile } = require("./uploadFile");
const { createRow } = require("./createRow.js");
const { verifyCode } = require("./verifyCode.js");
const { constructUrl } = require("./constructUrl.js");

const composeUploads = async ({ candidate1, candidate2 }, application_type) => {
  const photoBucket = process.env.PHOTO_BUCKET_ID;
  const cvBucket = process.env.CV_BUCKET_ID;
  let c1 = { photo: null, cv: null };
  let c2 = { photo: null, cv: null };
  //Upload cv1 and photo1
  const cv1Response = await uploadFile(candidate1.cv, cvBucket);
  c1.cv = cv1Response.$id;
  const photo1Response = await uploadFile(candidate1.photo, photoBucket);
  c1.photo = photo1Response.$id;
  if (application_type == "binome") {
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
  receivedData.candidate1_photo_url = constructUrl(
    c1.photo,
    process.env.PROJECT_ID,
    process.env.PHOTO_BUCKET_ID,
  );
  receivedData.candidate1_cv_url = constructUrl(
    c1.cv,
    process.env.PROJECT_ID,
    process.env.CV_BUCKET_ID,
  );
  receivedData.candidate2_photo_url = constructUrl(
    c2.photo,
    process.env.PROJECT_ID,
    process.env.PHOTO_BUCKET_ID,
  );
  receivedData.candidate2_cv_url = constructUrl(
    c2.cv,
    process.env.PROJECT_ID,
    process.env.CV_BUCKET_ID,
  );
  return receivedData;
};

const processFunction = async ({ req, res, log }) => {
  const { table_data, files, personal_code } = req.bodyJson;
  log("application_type: ");
  log(application_type);
  const { candidate1, candidate2 } = files;
  const { candidate1_mail, application_type } = table_data;

  try {
    //check code + email function
    const verified = await verifyCode({ candidate1_mail, personal_code });
    if (!verified) {
      throw new Error("unregistered");
    }
    //if invalid throw error with invalid code
    const { c1, c2 } = await composeUploads(
      { candidate1, candidate2 },
      application_type,
    );

    const row = prepareRow(table_data, { c1, c2 });

    await createRow(row);
    return res.text(JSON.stringify({ status: "success" }));
  } catch (err) {
    //Add cleanup logic
    if (err.message == "unregistered") {
      return res.text(JSON.stringify({ status: "unregistered" }));
    } else {
      log(err);
      return res.text(JSON.stringify({ status: "internal error: " + err }));
    }
  }
};

module.exports = processFunction;
