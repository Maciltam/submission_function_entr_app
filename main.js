const { uploadFile } = require("./uploadFile");
const createRow = require("./createRow.js");
const { constructUrl } = require("./getFileUrl.js");

const testObject = {
  key1: "value1",
  key2: "value2",
  key3: "value3",
};
const testString = JSON.stringify(testObject);

const testBuffer = Buffer.from(testString, "utf-8");

const mockupRequest = {
  body: {
    tableData: {},
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

const processFunction = ({ req, res }) => {
  const { tabeData, files } = req.body;
  const { candidate1, candidate2 } = files;

  let applicationType = "simple";
  if (candidate2.cv) {
    applicationType = "double";
  }

  let candidate1Urls = {};
  let candidate2Urls = {};

  const photoBucket = process.env.BUCKET_ID;
  const cvBucket = process.env.BUCKET_ID;
  const projectId = process.env.PROJECT_ID;

  if (applicationType == "simple") {
    uploadFile(candidate1.photo, photoBucket)
      .then((response) => {
        candidate1Urls.photo = constructUrl(
          response.$id,
          projectId,
          photoBucket,
        );
      })
      .then(() => {
        return uploadFile(candidate1.cv, cvBucket);
      })
      .then((response) => {
        candidate1Urls.cv = constructUrl(response.$id, projectId, cvBucket);
      });
  } else if (applicationType == "double") {
    uploadFile(candidate1.photo, photoBucket)
      .then((response) => {
        console.log("Candidate 1 photo upload response:", response);
        candidate1Urls.photo = constructUrl(
          response.$id,
          projectId,
          photoBucket,
        );
      })
      .then(() => {
        return uploadFile(candidate1.cv, cvBucket);
      })
      .then((response) => {
        console.log("Candidate 1 CV upload response:", response);
        candidate1Urls.cv = constructUrl(response.$id, projectId, cvBucket);
      })
      .then(() => {
        return uploadFile(candidate2.cv, cvBucket);
      })
      .then((response) => {
        console.log("Candidate 2 CV upload response:", response);
        candidate2Urls.cv = constructUrl(response.$id, projectId, cvBucket);
      })
      .then(() => {
        return uploadFile(candidate2.photo, photoBucket);
      })
      .then((response) => {
        console.log("Candidate 2 photo upload response:", response);
        candidate2Urls.photo = constructUrl(
          response.$id,
          projectId,
          photoBucket,
        );
      })
      .then(() => {
        return {
          candidate1: candidate1Urls,
          candidate2: candidate2Urls,
        };
      })
      .then((urls) => {
        console.log(urls);
      });
  }
};
processFunction({ req: mockupRequest, res: {} });
