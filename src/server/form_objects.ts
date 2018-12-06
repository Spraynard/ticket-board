/**
 * Returns an object that, when url-serialized, gives all necessary
 * key and value params in order to login to a website
 * @type {object}
 */
export const login_form_object = ( username: string, password: string ): object => {
	return {
		loginUsername : username,
		loginPassword : password,
		login : "Login"
	};
}

export const status_form_object = ( task_status: string, project_id: string ):object => {
	return {
		command : "vsdGetPage",
		modulePage : "taskList",
		ProjectID : project_id,
		TaskStatus : task_status,
		sort : "TaskPriority",
		search : "",
		ajax : "1",
		ajdt : "1"
	}
}