const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const hostname:string = '127.0.0.1';
const port:number = 3000;


import Web_Controller from "./Controller/Web_Controller";
const controller = new Web_Controller();

import { readFile } from "./Utility/Utility";

// Global Static Directory
const base_dir = path.resolve( __dirname, '../../' );

// class Server {
// 	private webController: Web_Controller;
// 	private cookieJarCabinet;

// 	constructor() {
// 		this.webController = new Web_Controller();
// 	}

// 	spin_up_server() => {

// 	}
// }
// Try and obtain the file that the user is pointing at, then try and find the route that the user is pointing at.
// If all fails then we write a 404
const server = http.createServer( async (req, res) => {
	let output_data;
	let route_handled = 0;
	const request_url = url.parse( req.url );
	console.log("Our Request URL", request_url);
	res.setHeader('Content-Type', 'text/html');
	res.statusCode = 200;

	// Route Handling
	if ( request_url.pathname === '/obtain-tickets' )
	{
		const logged_in_object = await controller.log_in();

		if ( logged_in_object )
		{
			output_data = await controller.obtain_ticket_data( logged_in_object );
		}
		else
		{
			res.statusCode = 401;
		}

		route_handled = 1;
	}

	if ( ! route_handled )
	{
		try {
			const filePath = ( request_url.pathname === '/' ) ? './index.html' : `.${request_url.pathname}`;

			output_data = await readFile( path.join( base_dir, filePath ) );

			switch ( path.extname( filePath ) ) {
				case ".js":
					res.setHeader('Content-Type', 'text/javascript');
					break;
				case ".css":
					res.setHeader('Content-Type', 'text/css');
					break;
				default:
					break;
			}
		} catch ( e ) {
			res.statusCode = 404;
		}
	}

	if ( route_handled && output_data === "" )
	{
		res.statusCode = 500;
	}

	res.end( output_data );
});


server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});