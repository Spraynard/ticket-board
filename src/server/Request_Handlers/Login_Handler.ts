import { login_form_object } from "../form_objects";
import Request_Handler from "./Request_Handler";
import * as data_params from "../../../config.data_params.json";

/**
 * Performs requests used to log in to the eTool
 * server.
 */
export default class Login_Handler extends Request_Handler {
	private login_data_param: string = data_params.login;
	private username: string;
	private password: string;

	constructor( username, password, site_list, debug ) {
		super( site_list, debug );
		this.username = username;
		this.password = password;
		this.fill_cabinet_with_jars();

		this.on('error', ( error ) => {
			console.log("login handler error: " + error);
		})
	}

	private get_site_url_array(): any {
		return this.site_list.reduce(( prev, current ) => {
			prev = prev.concat(current.url);
			return prev;
		}, []);
	}

	/**
	 * Initializes cookie jars per each site in the site_list
	 * in the cookie_jar_cabinet.
	 */
	private fill_cabinet_with_jars(): void {
		this.get_site_url_array().forEach( site => {
			this.cookie_jar_cabinet[site] = this.request_module.jar();
		});
	}

	private grab_cookies( website, cookie_jar ) {
		const request_with_data = this.prefill_request_with_data(
			login_form_object( this.username, this.password ),
			this.login_data_param,
			( body ) => true
		);
		return request_with_data( website, cookie_jar );
	}

	/**
	 * Logs in to eTools suite, grabs the login cookies,
	 * and fills out our cookie_jars with those cookies.
	 *
	 * A resolved return will output the cookie jar so that it
	 * can be shipped to other parts of the codebase.
	 * @return {Promise<any>} [description]
	 */
	public log_in(): Promise<any> {
		return new Promise<any>(( resolve, reject ) => {
			this.perform_request_operations( this.grab_cookies )
				.then(( values ) => {
					resolve( this.cookie_jar_cabinet );
				})
				.catch(( reason ) => {
					this.emit('error', 'log_in', reason);
				});
		});
	}
}