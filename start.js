const PORT = process.env.PORT || 5003

const app = require('./index')


app.listen(PORT, () => {

}).on('error', err => {
    console.log(`Error: ${ err }`)
})