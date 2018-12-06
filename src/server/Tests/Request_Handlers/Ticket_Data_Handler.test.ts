// import Ticket_Data_Handler from '../../Request_Handlers/Ticket_Data_Handler';
// import Login_Handler from '../../Request_Handlers/Login_Handler';

// let config;
// let cookie_jar_cabinet;
// let loginHandler;

// try {
// 	config = require('../../../config.json');
// } catch {
// 	console.log("Config Missing");
// }


// beforeAll(() => {
// 	loginHandler = new Login_Handler( config.user.username, config.user.password );
// 	return loginHandler.log_in();
// });

// describe("Ticket Data Handler", () => {

// 	let dataHandler = new Ticket_Data_Handler( config.task_status_include, config.site_list );

// 	beforeEach(() => {
// 		dataHandler.saturate_cabinet(this.loginHandler.cookie_jar_cabinet);
// 	})

// 	test("Takes in cookie jar cabinets", () => {
// 		expect( dataHandler.cookie_jar_cabinet ).toBeDefined();
// 	});

// 	test("Grabbing data gives us ticket data objects", () => {

// 	})
// });