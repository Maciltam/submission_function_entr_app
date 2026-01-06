const constructUrl = (fileId, projectId, bucketId) =>
  `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`;
("https://cloud.appwrite.io/v1/storage/buckets/695444ad00343bada62c/files/695d76ee00116164b443/view?project=6953103d002e7e747a96");

module.exports = { constructUrl };
