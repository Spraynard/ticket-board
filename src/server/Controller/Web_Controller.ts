// Config Import
import * as config from "../config.test.json";

// Module Imports
import Login_Handler from "../Request_Handlers/Login_Handler";
import Ticket_Data_Handler from "../Request_Handlers/Ticket_Data_Handler";
import Ticket_Parser from "../Parsers/Ticket_Parser";
import eVSD_Ticket_Data from "../Structs/eVSD_Ticket_Data";

let login_handler = new Login_Handler(
	config.user.username,
	config.user.password,
	config.site_list,
	false
);

export default class Web_Controller {
	public log_in() {
		return login_handler.log_in();
	}

	public async obtain_ticket_data( cookie_jar_cabinet ) {
		let ticket_html_array,
			structured_ticket_data,
			structured_ticket_data_html;

		let ticket_parser = new Ticket_Parser();
		let ticket_data_handler = new Ticket_Data_Handler( config.task_status_include, config.site_list, false );

		ticket_data_handler.saturate_cabinet( cookie_jar_cabinet );

		try {
			ticket_html_array = await ticket_data_handler.obtain_tickets();
		} catch ( e ) {
			console.log("error occured on ticket html array: ", e);
		}
		try {
			structured_ticket_data = await ticket_parser.digest( ticket_html_array );
		} catch ( e ) {
			console.log("error occured on structured ticket data: ", e);
		}

		return await structured_ticket_data.build_html();
	}
}