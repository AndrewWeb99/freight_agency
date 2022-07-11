const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

require('dotenv').config()
const app = express()

const session = require('express-session')


app.use(session({
	secret : "superSecret",
	saveUninitialized : true,
	resave : true,
	cookie : { 
		path: '/', 
		httpOnly: true, 
		secure: false, 
		maxAge: null 
	}
}))

const User = require('./models/User')

app.use(function(req, res, next) {

	if(req.session && req.session.user) {
		User.findOne({'login':req.session.user.login}, function(err, user) {
			if(err) {
				res.redirect('/login')
			}
			if(!user) {
				req.session.destroy();
				res.redirect('/login')
			} else {
				req.user = user;
				req.session.user = user
				res.locals.user = user
			}
			next()
		})
	} else {
		res.locals.user = null
		next()
	}
	
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.disable('x-powered-by')


mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected'))

app.set('view engine', 'ejs')
app.use('/public', express.static('public'))

app.use('', [
    require('./routes'),
	require('./routes/admin')
])


module.exports = app