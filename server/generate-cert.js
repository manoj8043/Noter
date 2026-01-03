const selfsigned = require('selfsigned');
const fs = require('fs');

const attrs = [{ name: 'commonName', value: 'localhost' }];
try {
  const pems = selfsigned.generate(attrs, { days: 365 });
  fs.writeFileSync('server.key', pems.private);
  fs.writeFileSync('server.cert', pems.cert);
  console.log('Certificates generated successfully.');
} catch (err) {
  console.error('Error generating certificates:', err);
}
