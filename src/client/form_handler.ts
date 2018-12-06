const form = document.getElementById('ticket-request-form');
const ticketDataContainer: HTMLElement = document.getElementById('ticket-data-section');

const submit_ticket_request = e => {
	e.preventDefault();

	let username: string = (<HTMLInputElement>document.getElementById('username-input')).value;
	let password: string = (<HTMLInputElement>document.getElementById('password-input')).value;

	let requestData = {
		username : username,
		password : password
	};

	fetch('/obtain-tickets', {
		method : "POST",
		body : JSON.stringify( requestData ),
		headers : {
			'Content-Type' : 'application/json; charset=utf-8'
		}
	}).then( response => {
		console.log( response );
		return response.text();
	}).then( text => {
		console.log( text );
		ticketDataContainer.innerHTML = text;
	})
	.catch( e => {
		console.log("Something Happened: ", e);
	})
}

form.addEventListener("submit", submit_ticket_request , false );
