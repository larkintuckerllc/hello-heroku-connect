const http = require('http');
const knex = require('knex');
const uuidv1 = require('uuid/v1');

const PORT = process.env.PORT || 5000;

const pg = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  searchPath: [ 'salesforce', 'public'],
});

const server = http.createServer(async (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  const external_contact_id__c = uuidv1().replace(/-/g, '');
  try {
    await pg('contact').insert({
      first: 'John',
      last: 'Doe',
      title: 'New',
      external_contact_id__c,
    });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('SUCCESS\n');
  } catch (err) {
    console.log(err);
    res.end('ERROR\n');
  }
});
server.listen(PORT, () => {
  console.log(`Server running on ${PORT}/`);
});

