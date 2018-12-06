import eVSD_Ticket from "./eVSD_Ticket";
const config = ( process.env.NODE_ENV === "development" ) ? require("../config.test.json") : require("../config.prod.json");

type Ticket_Data = {
	websites : Array<string>,
	website_names : object,
	tickets : Array<eVSD_Ticket>,
	website_ticket_xref : {
		[ key: string ] : Array<string>
	}
}

export default class eVSD_Ticket_Data {
	public ticket_data: Ticket_Data;

	constructor() {
		this.ticket_data = {
			websites : [],
			website_names : {},
			tickets : [],
			website_ticket_xref :{}
		}
	}

	private two_periods_website_url_test_regex = /\./g;
	private website_title_regex = /(?<=\/\/)(.*?)(?=\.)/;

	private website_title_from_regex = website => this.website_title_regex.exec( website )[0];
	private website_title_from_split = website => website.split('.')[0];

	private period_count_in_website_url = website => ( website.match( this.two_periods_website_url_test_regex ) || [] ).length;

	private obtain_website_title = website => {
		website = website.replace(/http:\/\/|https:\/\/|www\./g, "", website);

		let website_title = this.website_title_from_split( website );

		return website_title.charAt(0).toUpperCase() + website_title.slice(1);
	}

	// Updates this Ticket_Data instances ticket data.
	public update_data = ( website : string, ticket : eVSD_Ticket ) => {
		let ticket_data_copy = this.ticket_data;

		if ( ! ticket_data_copy.websites.includes( website ) )
		{
			ticket_data_copy.websites = [
				...ticket_data_copy.websites,
				website
			];
		}

		if ( ! ticket_data_copy.website_names.hasOwnProperty( website ) )
		{
			ticket_data_copy.website_names[website] = this.obtain_website_title( website );
		}

		ticket_data_copy.tickets = [
			...ticket_data_copy.tickets,
			ticket
		];

		if ( ! ticket_data_copy.website_ticket_xref.hasOwnProperty( website ) )
		{
			ticket_data_copy.website_ticket_xref[ website ] = [];
		}

		ticket_data_copy.website_ticket_xref = {
			...ticket_data_copy.website_ticket_xref,
			[ website ] : [
				...ticket_data_copy.website_ticket_xref[website],
				ticket.id
			]
		};

		this.ticket_data = { ...ticket_data_copy };
	}

	private filter_tickets_by_status = ( status: string, tickets: Array<eVSD_Ticket> ) => tickets.filter(
		ticket => status === ticket.status
	)

	private filter_tickets_by_website = ( website: string ) => this.ticket_data.tickets.filter(
			ticket => this.ticket_data.website_ticket_xref[website].includes( ticket.id )
	);

	private getSortedStatuses = () => this.ticket_data.tickets.reduce(
			( prev: Array<string>, current: eVSD_Ticket ) => prev.concat(
				( prev.includes( current.status ) ) ?
					[] : current.status
				), []).sort(
					( a, b ) => config.task_status_include.indexOf(a) - config.task_status_include.indexOf(b)
				);

	// Build overall HTML based on the ticket data associated with this class
	public async build_html() {
		let outputHTML = "";
		const websites = this.ticket_data.websites;
		const statuses = this.getSortedStatuses();

		for ( let i = 0; i < websites.length; i++ )
		{
			let website_filtered_tickets,
				website_filtered_tickets_count,
				status_filtered_tickets,
				status_filtered_tickets_count;

			const website = websites[i];
			const website_name = this.ticket_data.website_names[website];

			try {
				website_filtered_tickets = await this.filter_tickets_by_website( website );
				website_filtered_tickets_count = website_filtered_tickets.length;
			} catch ( e ) {
				console.error("We Failed On This Website: ", website);
				console.error("Our ticket xref at the time", this.ticket_data.website_ticket_xref);
				console.error("Error Gaining Our Tickets: ", e);
			}

			outputHTML += '<div class="ticket-data-container">';
			outputHTML += `<h2><strong>${website_name}</strong>: <small><i>${website_filtered_tickets_count} ${(website_filtered_tickets_count > 1) ? "tickets" : "ticket"}</i></small></h2>`;


			outputHTML += '<div class="ticket-status-container">';

			for ( let j = 0; j < statuses.length; j++ )
			{
				let status = statuses[j];

				try {
					status_filtered_tickets = await this.filter_tickets_by_status(
						status,
						website_filtered_tickets
					);
					status_filtered_tickets_count = status_filtered_tickets.length;

					if ( status_filtered_tickets.length )
					{
						outputHTML += `<h3 class="ticket-status"><strong>${status}</strong> - <small><i>${status_filtered_tickets_count} ${(status_filtered_tickets_count > 1) ? "tickets" : "ticket"}</i></small></h3>`;
					}

				} catch ( e ) {
					console.error("Error Gaining Our Tickets: ", e);
				}

				outputHTML += '<div class="ticket-container">';
				await status_filtered_tickets.forEach( ticket => outputHTML += ticket.output_html() );
				outputHTML += '</div>';
			}

			outputHTML += '</div></div>';
		}
		return outputHTML;
	}
}