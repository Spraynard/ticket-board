import {
	login_form_object,
	status_form_object
} from "../../form_objects";

let config_available = 1;

let config;

try {
	config = require( "../../config.json" );
} catch ( e ) {
	config_available = 0;
}

const fs = require('fs');

describe("Login Form Object", () => {
	test("Returns Initial Expected Values", () => {
		const test_form_object = login_form_object("username", "password");

		expect( test_form_object ).toEqual({
			loginUsername : "username",
			loginPassword : "password",
			login : "Login"
		});

	});
	if ( config_available ) {
		test("Returns Expected Values From Config", () => {
			const test_form_object = login_form_object(config.user.username, config.user.password);

			expect( test_form_object ).toEqual({
				loginUsername : config.user.username,
				loginPassword : config.user.password,
				login : "Login"
			});
		});
	}
})

describe("Status Form Object", () => {
	test("Returns Initial Expected Values", () => {
		const test_form_object = status_form_object("task_status", "project_id");

		expect( test_form_object ).toEqual({
			command : 'vsdGetPage',
			modulePage : 'taskList',
			ProjectID : 'project_id',
			TaskStatus : 'task_status',
			sort : 'TaskPriority',
			search : '',
			ajax : '1',
			ajdt : '1'
		});
	});
	if ( config_available ) {
		test("Returns Expected Values From Config", () => {
			const project_id = "1111";

			config.task_status_include.forEach(( status ) => {
				let test_form_object = status_form_object( status, project_id );

				expect( test_form_object ).toEqual({
					command : 'vsdGetPage',
					modulePage : 'taskList',
					ProjectID : project_id,
					TaskStatus : status,
					sort : 'TaskPriority',
					search : '',
					ajax : '1',
					ajdt : '1'
				});
			});
		});
	}
})