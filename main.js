const { uploadFile } = require("./uploadFile");
const { createRow } = require("./createRow.js");

const testObject = {
  key1: "value1",
  key2: "value2",
  key3: "value3",
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
  const { tableData, files } = request.bodyJson;
  const { candidate1, candidate2 } = files;

  let applicationType = "simple";
  if (candidate2.cv) {
    applicationType = "double";
  }

  let candidate1Ids = {};
  let candidate2Ids = {};

  const photoBucket = process.env.BUCKET_ID;
  const cvBucket = process.env.BUCKET_ID;
  log(photoBucket);
  log(cvBucket);

  if (applicationType == "simple") {
    uploadFile(candidate1.photo, photoBucket)
      .then((response) => {
        candidate1Ids.photo = response.$id;
      })
      .then(() => {
        return uploadFile(candidate1.cv, cvBucket);
      })
      .then((response) => {
        candidate1Ids.cv = response.$id;
      });
  } else if (applicationType == "double") {
    uploadFile(candidate1.photo, photoBucket)
      .then((response) => {
        console.log("Candidate 1 photo upload response:", response);
        candidate1Ids.photo = response.$id;
      })
      .then(() => {
        return uploadFile(candidate1.cv, cvBucket);
      })
      .then((response) => {
        console.log("Candidate 1 CV upload response:", response);
        candidate1Ids.cv = response.$id;
      })
      .then(() => {
        return uploadFile(candidate2.cv, cvBucket);
      })
      .then((response) => {
        console.log("Candidate 2 CV upload response:", response);
        candidate2Ids.cv = response.$id;
      })
      .then(() => {
        return uploadFile(candidate2.photo, photoBucket);
      })
      .then((response) => {
        console.log("Candidate 2 photo upload response:", response);
        candidate2Ids.photo = response.$id;
      })
      .then(() => {
        return {
          candidate1: candidate1Ids,
          candidate2: candidate2Ids,
        };
      })
      .then((ids) => {
        tableData.candidate1_photo_id = ids.candidate1.photo;
        tableData.candidate1_cv_id = ids.candidate1.cv;
        tableData.candidate2_photo_id = ids.candidate2.photo;
        tableData.candidate2_cv_id = ids.candidate2.cv;
        return tableData;
      })
      .then((row) => {
        const response = createRow(row);
        return response;
      })
      .then(() => {
        return res.text("success");
      })
      .catch(() => {
        return res.text("error");
      });
  }
};

module.exports = processFunction;
