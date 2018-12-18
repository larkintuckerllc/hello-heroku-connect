const http = require('http');
const knex = require('knex');
const uuidv1 = require('uuid/v1');

const PORT = process.env.PORT || 5000;
const delay = (period) => new Promise(resolve => setTimeout(() => resolve(), period));
const pg = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  searchPath: [ 'salesforce', 'public'],
});
const server = http.createServer(async (req, res) => {
  console.log('START');
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  const external_contact_id__c = uuidv1().replace(/-/g, '');
  try {
    await pg('contact')
      .insert({
        firstname: 'John',
        lastname: 'Doe',
        title: 'New',
        external_contact_id__c,
      });
    await delay(1500);
    await pg('contact')
      .where({ external_contact_id__c })
      .update({ title: 'Requested' });
    await delay(3000);
    const results = await pg('contact')
      .where({ external_contact_id__c })
      .select('title');
    console.log(results);
    const value = results[0].title;
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`${value}\n`);
  } catch (err) {
    console.log(err);
    res.end('ERROR\n');
  }
});
server.listen(PORT, () => {
  console.log(`Server running on ${PORT}/`);
});

