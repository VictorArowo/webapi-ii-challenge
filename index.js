const server = require('./server');

server.listen(process.env.PORT || 3300, () => {
  console.log('listening on ' + (process.env.PORT || 3300));
});
