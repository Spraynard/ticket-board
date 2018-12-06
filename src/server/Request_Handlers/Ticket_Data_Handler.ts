import {
	status_form_object
} from "../form_objects";

import { flatten_arrays } from "../Utility/Utility";

import Request_Handler from "./Request_Handler";

import * as data_params from "../../../config.data_params.json";

// Interfaces
interface Ticket_Data_Object {
	website : string,
	status 	: string,
	ticket_html : string
}

/**
 * Performs requests used to grab ticket data from the VSD of a website.
 */
export default class Ticket_Data_Handler extends Request_Handler {
	private ticket_data_param: string = data_params.ticket_obtain;

	constructor( task_status_list, site_list, debug ) {
		super( site_list, debug );
		this.task_status_list = task_status_list;
	}

	private create_ticket_data_object( data_object: Ticket_Data_Object ) {
		return data_object;
	}

	private apply_basic_ticket_data( website: string, status: string ) {
		return ( ticket_html ) => ({
			website : website,
			status : status,
			ticket_html : ticket_html
		})
	}

	private resolution_handler( func ) {
		return ( ticket_html ) => {
			return func( ticket_html );
		}
	}

	private grab_tickets( website: string, cookie_jar ) {
		let ticket_operations_container: any[] = [];

		let site_project_id: string = this.site_list.filter( value => value.url === website )[0].project_id;

		this.task_status_list.forEach(( status ) => {
			const basic_ticket_data = this.apply_basic_ticket_data( website, status );

			const request_with_data = this.prefill_request_with_data(
				status_form_object( status, site_project_id ),
				this.ticket_data_param,
				this.resolution_handler( basic_ticket_data )
			);

			ticket_operations_container.push( request_with_data( website, cookie_jar ) );
		});

		return Promise.all( ticket_operations_container );
	}

	/**
	 * Fills out this object's cabinet with the input param
	 * @param {} cookie_jar_cabinet [description]
	 */
	public saturate_cabinet( cookie_jar_cabinet: object ): void {
		this.cookie_jar_cabinet = { ...cookie_jar_cabinet };
	}

	public obtain_tickets() {
		return Promise.resolve( this.perform_request_operations( this.grab_tickets ) )
			.then( ( ticket_html_data: [ Array<{ website : string, status : string, ticket_html : string}> ] ) => flatten_arrays( ticket_html_data ) );
	}
}