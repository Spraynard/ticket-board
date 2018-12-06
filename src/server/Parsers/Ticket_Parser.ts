import { JSDOM } from "jsdom";
const jQuery = require('jquery');

import { pipe } from "../Utility/Utility";
import eVSD_Ticket from "../Structs/eVSD_Ticket";
import eVSD_Ticket_Data from "../Structs/eVSD_Ticket_Data";

export default class Ticket_Parser {
	private ticket_data_array: Array<{ website: string, status : string, ticket_html : string }>
	private ticket_data_object: eVSD_Ticket_Data = new eVSD_Ticket_Data();
	public ticket_data: Array<object>;

	private remove_script_tags( ticket_html: string ) {
		const { window } = new JSDOM( ticket_html );
		const { document } = window;

		let $ = ( jQuery )( window )

		let script_tags = $("script").remove;

		return document.body.innerHTML
	}

	private apply_ticket_data_to_output_object( ticket_data ): void {
		const { website, status, ticket_html } = ticket_data;
		const { window } = new JSDOM( ticket_html );
		const { document } = window;
		let $ = ( jQuery )( window );

		// Have a .task-list-row class associated with them.
		let $tickets_from_html = $(".taskListRow");

		$tickets_from_html.each(( index, element ) => {
			if ( $(element).length === 0 )
			{
				return;
			}

			let author = $(element).find(".author").text().trim(),
				create_date = $(element).find(".createDate").text().trim(),
				id = $(element).attr('id').split("_")[1].trim(),
				priority = $(element).find(".taskPriority").text().trim(),
				title = $(element).find(".taskTitle").text().trim(),
				blog_count = ( $(element).find(".blogCount").text().trim().length === 0 ) ?
					"0"
					:
					$(element).find(".blogCount").text().trim();


			const ticket_data_object = {
				author,
				create_date,
				id,
				priority,
				title,
				blog_count,
				status,
			}

			const ticket_struct: eVSD_Ticket = new eVSD_Ticket( ticket_data_object );

			this.ticket_data_object.update_data( website, ticket_struct );

		});
	}

	private inner_html( ticket_html: string ) {
		const { window } = new JSDOM( ticket_html );
		const { document } = window;
		return document.body.innerHTML;
	}

	public async digest( ticket_data_array ) {
		for ( const ticket_data_object of ticket_data_array ) {

			let { website, status, ticket_html } = ticket_data_object;
			ticket_html = this.inner_html( ticket_html );

			try {
				await this.apply_ticket_data_to_output_object({ website, status, ticket_html });
			} catch ( e ) {
				throw new Error( e );
			}
		}
		return this.ticket_data_object;
	}
}