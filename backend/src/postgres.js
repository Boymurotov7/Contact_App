const { Pool } = require('pg')
const config = require("../config.js")


const pool = new Pool({
	user: process.env.PG_USER,
	password: process.env.PG_PASSWORD,
	port: process.env.PG_PORT,
	host: process.env.PG_HOST,
	database: process.env.PG_NAME,
})

module.exports = (req, res, next) => {
	req.fetch = async function (query, ...params) {
		const client = await pool.connect()
		try {
			const { rows } = await client.query(query, params.length ? params : null)
			return rows
		} catch(error) {
			console.log('database error: ', error)
		} finally {
			client.release()
		}
	}

	return next()

}