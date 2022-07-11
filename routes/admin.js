const router = require('express').Router()
const path = require('path')

const mongoose = require('mongoose')
const User = require('../models/User')
const Stat = require('../models/Stat')
const News = require('../models/News')
const Cargo = require('../models/Cargo')

const puppeteer = require('puppeteer')

const multer = require('multer')

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, __dirname + '/../public/img/uploads')
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
	}
})

const upload = multer({ storage })

router.get('/admin', async (req, res) => {

	const users = await User.find({})

	res.render('admin_templates/index', { users })
})

router.get('/orders', async (req, res) => {

	const orders = await Cargo.find({})

	res.render('admin_templates/orders', { orders })
})

router.get('/deleteUsersOrder', async (req, res) => {

	const id = req.query.id
	const redir = req.query.redir

	Cargo.findByIdAndRemove(id)
		.then(data => {
			if (!data) {
				if (redir) {
					res.redirect('/' + redir)
				}
				else res.redirect('/orders')

			} else {
				if (redir) {
					res.redirect('/' + redir)
				}
				else res.redirect('/orders')
			}
		})
		.catch(err => {
			console.log(err)
			if (redir) {
				res.redirect('/' + redir)
			}
			else res.redirect('/orders')
		})
})

router.get('/news', async (req, res) => {

	res.render('admin_templates/news')
})

router.get('/edit_main', async (req, res) => {

	const stat = await Stat.find({})

	res.render('admin_templates/edit_main', { stat })
})

router.get('/deleteUser', async (req, res) => {

	const id = req.query.id

	User.findByIdAndRemove(id)
		.then(data => {
			if (!data) {
				res.redirect('/admin')
			} else {
				res.redirect('/admin')
			}
		})
		.catch(err => {
			console.log(err)
			res.redirect('/admin')
		})
})

router.get('/blockUser', async (req, res) => {

	const id = req.query.id


	User.findByIdAndUpdate(id, { isBlocked: true })
		.then(data => {
			if (!data) {
				res.redirect('/admin?error=1')
			} else res.redirect('/admin')
		})
		.catch(err => {
			console.log(err)
			res.redirect('/admin')
		})

})

router.get('/unblockUser', async (req, res) => {

	const id = req.query.id


	User.findByIdAndUpdate(id, { isBlocked: false })
		.then(data => {
			if (!data) {
				res.redirect('/admin?error=1')
			} else res.redirect('/admin')
		})
		.catch(err => {
			console.log(err)
			res.redirect('/admin')
		})

})

router.post('/insertStat', async (req, res) => {

	const id = req.body._id
	const obj = {
		clients: req.body.clients,
		country: req.body.country,
		active_employers: req.body.active_employers,
		finished: req.body.finished
	}

	Stat.findByIdAndUpdate(id, obj)
		.then(data => {
			if (!data) {
				res.redirect('/admin?error=1')
			} else res.redirect('/edit_main')
		})
		.catch(err => {
			console.log(err)
			res.redirect('/admin')
		})

})

router.post('/initStat', async (req, res) => {
	const initStat = new Stat({
		clients: req.body.clients,
		country: req.body.country,
		active_employers: req.body.active_employers,
		finished: req.body.finished
	})

	initStat.save((err) => {
		if (!err) {
			res.redirect('/admin')
		}
		else {
			console.log(err)
		}
	})
})


router.get('/getStat', async (req, res) => {

	const stat = await Stat.find({})

	res.json(stat[0])
})

router.post('/addNews', upload.single('img'), async (req, res) => {

	if (!req.file) {
		return res.redirect('/admin?error=Нет изображения')
	}

	const addNews = new News({
		title: req.body.title,
		text: req.body.text,
		img: req.file.filename
	})

	addNews.save((err) => {
		if (!err) {
			res.redirect('/admin')
		}
		else {
			console.log(err)
		}
	})
})

router.get('/getNews', async (req, res) => {
	const news = await News.find({})

	res.json(news)

})

router.get('/deleteNews', async (req, res) => {

	const id = req.query.id

	News.findByIdAndRemove(id)
		.then(data => {
			if (!data) {
				res.redirect('/news?error=Ошибка удаления')
			} else {
				res.redirect('/news')
			}
		})
		.catch(err => {
			console.log(err)
			res.redirect('/news?error=Ошибка')
		})
})

router.get('/getOneNews', async (req, res) => {
	const news = await News.findOne({ _id: req.query.id })

	res.json(news)

})

router.post('/editNews', upload.single('img'), async (req, res) => {

	const id = req.body._id
	const obj = {
		text: req.body.text,
		title: req.body.title,
	}

	if (req.file) {
		obj.img = req.file.filename
	}

	News.findByIdAndUpdate(id, obj)
		.then(data => {
			if (!data) {
				res.redirect('/news?error=1')
			} else res.redirect('/news')
		})
		.catch(err => {
			console.log(err)
			res.redirect('/news')
		})

})

router.get('/generatePDF', async (req, res) => {
	const track_id = req.query.id

	const browser = await puppeteer.launch()     // запускаем браузер
	const page = await browser.newPage()         // создаем новую вкладку
	await page.goto('http://localhost:5003/PDFpage?id=' + track_id)  // переходим на сайт
	await page.pdf({
		path: __dirname + '/../public/pdf/' + track_id + '.pdf', margin: {
			top: "30px",
			bottom: "40px",
			left: "40px",
			right: "20px"
		}, format: 'A4'
	})           // генерируем pdf текущей страницы и сохраняем его в файл page.pdf

	await browser.close()                        // закрываем браузер

	res.sendFile(path.join(__dirname + '/../public/pdf/' + track_id + '.pdf'))
})

router.get('/PDFpage', async (req, res) => {
	const track_id = req.query.id

	if (track_id == "") {
		res.json({
			status: false
		})
	}

	const order = await Cargo.findOne({ track_id })

	console.log(order)

	res.render('pdf', { order: order })
})




router.post('/changeStatus', upload.single('img'), async (req, res) => {

	const id = req.body._id

	const statuses = ['Заказ в обработке', 'Заказ оформлен', 'Заказ в дороге', 'Заказ доставлен', 'Возвращен']

	Cargo.findByIdAndUpdate(id, { track_status: req.body.cargo_status, track_status_text: statuses[req.body.cargo_status] })
		.then(data => {
			if (!data) {
				res.redirect('/orders?error=1')
			} else res.redirect('/orders')
		})
		.catch(err => {
			console.log(err)
			res.redirect('/orders')
		})

})





module.exports = router