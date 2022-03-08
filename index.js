const http = require('http');
const { getBodyWithForAwait } = require('./helpers');
const beerRouter = require('./routes/beer-router');
const path = require('path');
const { networkInterfaces } = require('os');
const fsPromise = require('fs').promises;

const server = http.createServer();

server.on('request', async (req, res) => {
  const { method, url } = req;
  
  //se url começa com /beer crio um arquivo que extrai isso
  if (url.startsWith('/beer')) {
    //beerRouter(req, res);
    const body = await getBodyWithForAwait(req);
    res.writeHead(201, { 'Content-Type': 'application/json' });
    const contents = { beer: body, create_at: new Date().toISOString(), };
    const criacao = new Date().getDate();
    
    const data = new Date();
    /*const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    dataAtual = dia + '_' + mes + '_' + ano;*/
    
    const hora    = data.getHours();          // 0-23
    const min     = data.getMinutes();        // 0-59
    const seg     = data.getSeconds();        // 0-59
    const mseg    = data.getMilliseconds();   // 0-999

    const dataParse = Date.parse (data + hora + min + seg + mseg);

    res.end(JSON.stringify(contents));
    
    (async () => {
      const folderPath = path.join(__dirname);
      const allFiles = await fsPromise.readdir(folderPath);
      const txtFiles = allFiles.filter(file => file.endsWith('.txt'));
    
      console.log("pasta "+folderPath);
      /*const readPromises = txtFiles.map(txtFile => {
        const filePath = path.join(__dirname, txtFile);
        return fsPromise.readFile(filePath, 'utf-8');
      });*/
      /*const contents = await Promise.all(readPromises);
      console.log(
        'all content:\n',
        contents.join('\n'),
        '\n--------------\n'
      );*/
      /*const firstToResolve = await Promise.race(readPromises);
      console.log(`first to resolve was: ${firstToResolve}`);*/

      fsPromise.writeFile(`${dataParse}.txt`, body, (err) => {
        if (err) throw err;
        console.log('O arquivo foi criado!');
      });
    })();
  } else {
    res.statusCode = 404;
    res.end('resource not found');
  }
});

server.listen(8080, () => {
  console.log(`escutando em http://localhost:8080`);
});