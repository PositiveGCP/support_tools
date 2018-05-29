const Storage = require('@google-cloud/storage');
const storage = new Storage();

const bucketName = 'cloud/--KxtjsNNxx27vc6CFp-l';

// Lists files in the bucket
storage
  .bucket(bucketName)
  .getFiles()
  .then(results => {
    const files = results[0];

    console.log('Files:');
    files.forEach(file => {
      console.log(file.name);
    });
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
