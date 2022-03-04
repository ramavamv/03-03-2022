const http = require('http');
const { getBodyWithForAwait } = require('./helpers');
const beerRouter = require('./routes/beer-router');

const server = http.createServer();

server.on('request', async (req, res) => {
  const { method, url } = req;
  
  //se url começa com /beer crio um arquivo que extrai isso
  if (url.startsWith('/beer')) {
    //beerRouter(req, res);
    const body = await getBodyWithForAwait(req);
    res.writeHead(201, { 'Content-Type': 'application/json' });
    const responseObject = { beer: body, create_at: new Date().toISOString(), };
    res.end(JSON.stringify(responseObject));
  } else {
    res.statusCode = 404;
    res.end('resource not found');
  }
});

server.listen(8080, () => {
  console.log(`escutando em http://localhost:8080`);
});