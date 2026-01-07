const { assert } = require("chai");

const { createRow } = require("../createRow.js");
const { uploadFile } = require("../uploadFile.js");
const { verifyCode } = require("../verifyCode.js");
require("dotenv").config();

const testObject = {
  key1: "value1",
  key2: "value2",
};
const testString = JSON.stringify(testObject);
const testBuffer = Buffer.from(testString, "utf-8");

describe("main function test", async () => {
  const response = await mainFunction(mockupRequest);
  assert.equal(response, { some: "object" });
});

// Create row tests
const mockupRow = {
  candidate1_name: "John Doe",
  candidate2_name: "John Doe",
  candidate1_mail: "mail1",
  candidate2_mail: "mail2",
  candidate1_cv_url: "id",
  candidate2_cv_url: "id",
  candidate1_photo_url: "id",
  candidate2_photo_url: "id",
  short_description: "short description",
  long_description: "long description",
  department: "dept",
};
describe("Create-row-function tests", () => {
  it("Should create and return the row", async () => {
    const response = await createRow(mockupRow);
    assert.deepInclude(response, mockupRow);
  });
});

// Create and upload file
const mockupFile = Buffer.from(
  JSON.stringify({ key1: "value1", key2: "value2" }),
  "binary",
);

describe("Upload-file-function tests", () => {
  it("should upload file", async () => {
    const response = await uploadFile(
      {
        content: mockupFile,
        name: "file.json",
      },
      process.env.PHOTO_BUCKET_ID,
    );

    assert.exists(response.$createdAt);
  });
});

describe("Check code", () => {
  it(
    "It should recognize a valid code",
    async () => {
      const response = await verifyCode({
        candidate1_mail: "test@test.com",
        personal_code: "GMx0C",
      });

      assert.equal(true, response);
    },
    it("should recognize an invalid code", async () => {
      const response = await verifyCode({
        candidate1_mail: "mail2",
        personal_code: "code1",
      });

      assert.equal(false, response);
    }),
  );
});
