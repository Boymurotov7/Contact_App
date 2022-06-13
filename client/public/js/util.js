const backendApi = 'http://localhost:5000'

async function request (path, method, body) {
	const response = await fetch(backendApi + path, {
		method,
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		body: body ? JSON.stringify(body) : null
	})
	return await response.json()
}


function createElements (...array) {
	return array.map( el => document.createElement(el) )
}