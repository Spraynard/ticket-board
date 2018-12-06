export default class eVSD_Ticket {
	public author : string; // Author of ticket
	public create_date: string; // Creation date of ticket
	public id : string; // ID of ticket
	public priority: string; // Priority of ticket
	public title : string; // Title of ticket
	public assignee : string; // Person ticket is assigned to
	public blog_count : string // Number of blogs that a ticket has associated with it.
	public status : string // Status of the ticket

	constructor ( ticket_data_object ) {
		Object.assign( this, ticket_data_object );
	}

	private obtainAuthorName = ( string: string ) => ( string.indexOf('-') > -1 ) ?
		string.split("-")[1].trim()
		:
		string.trim();

	public output_html = () => {
		return `<div class="ticket" data-ticket-id="${this.id}">
					<div class="ticket-content">
						<h3 class="ticket-title">${this.title}</h4>
						<p class="ticket-data">
							<span class="ticket-data-header"><strong><u>ID</u></strong>:</span><span class="ticket-data-value">${this.id}</span>
						</p>
						<p class="ticket-data">
							<span class="ticket-data-header"><strong><u>Date Created</u></strong>:</span><span class="ticket-data-value">${this.create_date}</span>
						</p>
						<p class="ticket-data">
							<span class="ticket-data-header"><strong><u>Author</u></strong>:</span><span class="ticket-data-value">${this.obtainAuthorName(this.author)}</span>
						</p>
						<p class="ticket-data">
							<span class="ticket-data-header"><strong><u>Priority</u></strong>:</span><span class="ticket-data-value">${this.priority}</span>
						</p>
						<p class="ticket-data">
							<span class="ticket-data-header"><strong><u>Blog Count</u></strong>:</span><span class="ticket-data-value">${this.blog_count}</span>
						</p>
					</div>
				</div>`;
	}
}