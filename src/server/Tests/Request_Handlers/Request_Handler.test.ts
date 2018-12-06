let Login_Handler = require('../../Request_Handlers/Login_Handler')

let config;
let cookie_jar_cabinet;
let loginHandler;

try {
	config = require('../../../config.json');
} catch {
	console.log("Config Missing");
}

describe("Ticket Data Handler", () => {

	test("Takes in cookie jar cabinets", () => {
		expect( 1 ).toEqual( 1 );
	});
});