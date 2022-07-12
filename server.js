'use strict';
const http = require('http');
const Captcha = require('.');
const PORT = 8181;

function handleRequest(req, res) {
	if (req.method === 'GET' && (req.url === '/' || req.url.indexOf('index') > -1)) {
		const result = new Captcha({
			length: 8,
			width: 350,
			height: 100,
			color: 'random',
		});

		console.log(result);

		const source = result.image;
		res.end(
			`
    <!doctype html>
    <html>
        <head>
            <title>Test Captcha</title>
        </head>
        <body>
        <label>Test image</label>
        <div><img src="${source}" /></div>
        </body>
    </html>
    `,
		);
	}
	else {
		res.end('');
	}
}

// Create a server
const server = http.createServer({}, handleRequest);

// Start server
server.listen(PORT, function() {
	console.log('Server listening on: http://localhost:' + PORT);
});
