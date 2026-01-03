const constructUrl = (fileId, projectId, bucketId) =>
  ` https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${fileId}/preview?project=${projectId}`;

module.exports = { constructUrl };
