const { assert } = require("chai");
const mainFunction = require("../main.js");

const testObject = {
  key1: "value1",
  key2: "value2",
};
const testString = JSON.stringify(testObject);
const testBuffer = Buffer.from(testString, "utf-8");

const mockupRequest = {
  bodyJson: {
    table_data: {
      candidate1_name: "John Doe",
      candidate2_name: "John Doe",
      candidate1_mail: "mail1",
      candidate2_mail: "mail2",
      short_description: "short description",
      long_description: "long description",
    },
    files: {
      candidate1: {
        cv: {
          content: testBuffer,
          name: "file.ext",
        },
        photo: {
          content: testBuffer,
          name: "file.ext",
        },
      },
      candidate2: {
        cv: {
          content: testBuffer,
          name: "file.ext",
        },
        photo: {
          content: testBuffer,
          name: "file.ext",
        },
      },
    },
    personal_code: "code1",
    application_type: "monome",
  },
};

describe("main function test", async () => {
  const response = await mainFunction(mockupRequest);
  assert.equal(response, { some: "object" });
});

describe("main function tests", () => {
  (it("Should create and return the user", async () => {
    const response = await mainFunction(mockupRequest);
    assert.equal(response, { some: "object" });
  }),
    it("Should do something else", () => {
      assert.equal("1", "1");
    }));
});
