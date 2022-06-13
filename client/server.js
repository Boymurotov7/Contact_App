const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 4000

const app = express()

app.set('views', path.join(process.cwd(), 'views'))

app.use(express.static(path.join(process.cwd(),'public')))
app.use((req, res, next) => {
	res.render = function (filename) {
		return res.sendFile(path.join(app.get('views'), filename + '.html') )
	}

	return next()
})

app.get('/', (req, res) => res.render('index1'))
app.get('/categories', (req, res) => res.render('categories'))
app.get('/create', (req, res) => res.render('createcontact'))
app.get('/search', (req, res) => res.render('search'))
app.get('/update', (req, res) => res.render('updatecontact'))
app.get('/contact', (req, res) => res.render('contact'))

app.listen(PORT, () => console.log('Client server is running on ' + PORT))