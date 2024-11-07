// config for google cloud storage
const { Storage } = require("@google-cloud/storage");

const bucketName = process.env.GCS_BUCKET_NAME;

const gcsStorage = new Storage({
  projectId: process.env.GCS_PROJECT_ID,
  credentials: {
    type: process.env.GCLOUD_TYPE,
    project_id: process.env.GCLOUD_PROJECT_ID,
    private_key_id: process.env.GCLOUD_PRIVATE_KEY_ID,
    private_key: process.env.GCLOUD_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.GCLOUD_CLIENT_EMAIL,
    client_id: process.env.GCLOUD_CLIENT_ID,
    auth_uri: process.env.GCLOUD_AUTH_URI,
    token_uri: process.env.GCLOUD_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GCLOUD_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.GCLOUD_CLIENT_X509_CERT_URL,
    universe_domain: process.env.GCLOUD_UNIVERSE_DOMAIN,
  },
});

const gcsBucket = gcsStorage.bucket(bucketName);

module.exports = gcsBucket;
