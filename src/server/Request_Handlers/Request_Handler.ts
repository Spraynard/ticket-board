import * as request from "request";
let EventEmitter = require('events');

export default class Request_Handler extends EventEmitter {
	// Strings needed for posts to obtain login and
	// ticket data, respectively.
	public cookie_jar_cabinet: object = {};
	public site_list: { url: string, project_id: string }[]
	public request_module

	constructor( site_list: { url: string, project_id: string }[], debug: boolean = false ) {
		super();
		this.site_list = site_list;
		this.debug = debug;
		this.request_module = request;
	}

	private get_cookie_jar_cabinet(): object {
		return this.cookie_jar_cabinet;
	}

	/**
	 * For Debug
	 */
	public display_cabinet(): void {
		console.log(JSON.stringify(this.get_cookie_jar_cabinet(), null, 4));
	}

	/**
	 * Main Request handler.
	 * @param {[type]} request_options [description]
	 */
	public async make_request( request_options, resolution_handler ) {
		return new Promise( ( resolve, reject ) => {
			request( request_options , ( error, response, body ) => {
				if ( error )
				{
					this.emit('error', error );
					reject(false);
				}

				if ( response.statusCode !== 200 && response.statusCode !== 302 )
				{
					let status_code_error_message = `${response.statusCode} ${response.statusMessage}
					${body}`
					this.emit('error', status_code_error_message );
					reject(false);
				}

				// Handles what to do with the specific return of the body based on the function input from a child class.
				const resolution_data = resolution_handler( body );

				resolve(resolution_data);
			});
		});
	}

	/**
	 * Fills in portions of our request handling functions that make it easier to
	 * perform actual requests
	 * @param {[type]} form_object      - Child class specific form uri params object that gets added to our request uri
	 * @param {[type]} uri_param        - Child class (of this class) specific uri_param that it deals with
	 * @param {func} resolution_handler - Function that manipulates the data returned from a request
	 */
	public prefill_request_with_data( form_object, uri_param, resolution_handler ) {
		return async ( website, cookie_jar ) => {
			let request_options = {
				method : "POST",
				uri : website + uri_param,
				formData : form_object,
				jar : cookie_jar,
			};

			return await this.make_request( request_options, resolution_handler );
		};
	}

	public perform_request_operations( jar_operation ): Promise<any[]> {
		let request_operation_container = [];

		for ( const website of Object.keys(this.get_cookie_jar_cabinet()) ) {
			let jar = this.get_cookie_jar_cabinet()[website];
			request_operation_container.push( jar_operation.apply( this, [website, jar] ) );
		};
		return Promise.all( request_operation_container );
	}
}