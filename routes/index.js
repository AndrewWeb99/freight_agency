const router = require('express').Router()
const app = require('../index')
const cryptoRandomString = require('crypto-random-string')

const User = require('../models/User')
const Stat = require('../models/Stat')
const Cargo = require('../models/Cargo')
const News = require('../models/News')

function isLogedIn(req, res, next){
	if(req.user) {
		next()
	} else{
		res.redirect('/login')
	}

}

router.get('/', async (req, res) => {
	let stat = await Stat.find({})
	let news = await News.find({ })
	stat = stat[0]

    res.render('index', { stat, news })
})

router.get('/singleNews', async (req, res) => {
	const id = req.query.id

	let news = await News.findOne({ _id: id })

    res.render('singleNews', { news })
})

router.get('/pricing', (req, res) => {
    res.render('pricing')
})

router.get('/about', (req, res) => {
    res.render('about')
})
router.get('/documents', (req, res) => {
    res.render('documents')
})

router.get('/service', (req, res) => {
    res.render('service')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.get('/profile', isLogedIn, (req, res) => {
    res.render('profile')
})

router.get('/order', isLogedIn, (req, res) => {
    res.render('order')
})

router.get('/myorders', isLogedIn, async (req, res) => {
	const orders = await Cargo.find({ user_id: req.session.user._id })

    res.render('myOrders', { orders })
})


router.post('/register', async function(req, res) {
    if(req.body.login == 'admin') {
		res.redirect('/register?error=1')
	}
	const newUser = new User({
		login : req.body.login,
		first_name : req.body.first_name,
		second_name : req.body.second_name,
		email : req.body.email,
		phone_number : req.body.phone_number,
        password : req.body.password
	})

	newUser.save(function(err) {
		if(!err) {
			req.session.user = newUser; 
			res.redirect('/profile')
		}
        else {
            console.log(err)
        }
	})
})

router.post('/login', function(req, res) {

	if(req.body.login == 'admin' && req.body.password == 'admin') {
		return res.redirect('/admin')
	}
    
	User.findOne({ 'login': req.body.login }, function(err, user) {
        
		if(err) {
			res.render('login')
            console.log(err)
		}
		if(!user) {
			res.render('login')
            console.log('ничего не найдено')

		} else {
			if(user.isBlocked) {
				return res.redirect('login')
			}
			if(req.body.password == user.password) {
				req.session.user = user;
				res.redirect('/profile')
				
			} else {
				res.render('login')
			}
		}
	})
})

router.get('/logout', function(req, res){
	req.session.destroy()
	res.redirect('/login')
})

router.post('/updateUser', function(req, res) {

	if(!res.locals.user) {
		res.redirect('/login')
	}

	const id = res.locals.user._id

	const update = {}

	if(!req.body.password == "") {
		update.password = req.body.password
	}

	if(!req.body.email == "") {
		update.email = req.body.email
	}

	update.first_name = req.body.first_name
	update.second_name = req.body.second_name
	update.phone_number = req.body.phone_number


	User.findByIdAndUpdate(id, update)
		.then(data => {
			if (!data) {
				res.redirect('/profile?error=1')
			} else res.redirect('/profile')
		})
		.catch(err => {
			console.log(err)
			res.redirect('/profile')
		})
})

router.post('/newOrder', isLogedIn, function(req, res) {

	const id = res.locals.user._id
	const phone_number = res.locals.user.phone_number
	const user_name = res.locals.user.first_name


	const update = {
		from: req.body.from,
		to: req.body.to,
		weight: req.body.weight,
		cargo_price: req.body.cargo_price,
		cargo_type: req.body.cargo_type,
		transport_type: req.body.transport_type,
		documents_transport: req.body.documents_transport == 'on'? true : false,
		return_documents: req.body.return_documents == 'on'? true : false,
		plobmbir_cargo: req.body.plobmbir_cargo == 'on'? true : false,
		plobmbir_cargo_count: req.body.plobmbir_cargo_count,
		thin_cargo: req.body.thin_cargo == 'on'? true : false,
		pack_cargo: req.body.pack_cargo == 'on'? true : false,
		transport_sum_value: req.body.transport_sum_value,
		days_value: req.body.days_value,
		km_value: req.body.km_value,
		user_id: id,
		phone_number,
		user_name,
		track_id: cryptoRandomString({ length: 10 }),
		track_status: 0,
		track_status_text: 'В обработке'
	}

	if(req.body.transport_type == 'main') {
		update.height =  req.body.height;
		update.weight = req.body.weight;
		update.width = req.body.width;
		update.len = req.body.len;
		update.volume = parseFloat((+req.body.height * +req.body.width * +req.body.len).toFixed(3));
	}
	else {
		update.total_weight = req.body.total_weight;
		update.total_volume = req.body.total_volume;
		update.max_size = req.body.max_size;
	}

	const newCargo = new Cargo(update)

	newCargo.save(function(err) {
		if(!err) {
			res.redirect('/myorders')
		}
        else {
			res.redirect('/profile?error=1')
            console.log(err)
        }
	})
})

router.get('/getOrders', async (req, res) => {
	const orders = await Cargo.find({  })

	res.json(orders)
})

router.get('/trackCargo/:track_id', async (req, res) => {
	let track_id = req.params.track_id

	const orders = await Cargo.findOne({ track_id })

	res.json(orders)
})




module.exports = router