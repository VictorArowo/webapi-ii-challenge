const redis = require('redis');
const client = redis.createClient(6379);

client.on('error', err => {
  console.log('Error ' + err);
});

client.on('connect', function() {
  console.log('Redis client connected');
});

module.exports = client;
