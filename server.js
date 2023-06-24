const http = require('http');
const handler = require('serve-handler');
const fs = require('fs');

/*-----------显示一个首页--------*/

const server = http.createServer((request, response) => {
    return handler(request, response,{
  "rewrites": [
    { "source": "/", "destination": "/build/index.html" },
  ]
});
    const { url, method, headers } = request;
    
  if (url === '/' && method === 'GET') {
    fs.readFile('./build/index.html', (err, data) => {
      if (err) {
          response.writeHead(500, { 'content-type': 'text/palin;charset:utf-8' });
        response.end('出错了 服务器错误');
        return;
      }
      response.statusCode = 200;
      response.setHeader('content-type', 'text/html');
      response.end(data);
    });
  } else if (['.css', '.js', '.png', '.ico','.svg','.webp','.jpg','.woff'].some(key => url.endsWith(key))) { 
    response.statusCode = 200;
    response.setHeader("Cache-Control", "max-age=864000"); // 设置缓存时常；请求的当前时间+max-age 的相对时间内，优先级比Expires高
    fs.createReadStream('./build'+url).pipe(response); //此时URL= /png
  } else {
    response.statusCode = 404;
    response.setHeader('content-type', 'text/plain');
    response.end('找不到此页面');
  }
});

server.listen(3200, () => { 
    console.log('node 启动成功 3200端口')
});

