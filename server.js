const express = require('express')
const app = express()
const ejs = require('ejs')
const bodyParser = require('body-parser')
const path = require('path')
const {createPool} = require('mysql')
const bcrypt = require('bcryptjs')
const session = require('express-session')

const conn = createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "blood_bank"
})
app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false
}))
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.json())
app.set('view engine', 'ejs')
app.use('/images', express.static(path.resolve(__dirname, 'assets/images')))
app.use('/css', express.static(path.resolve(__dirname, 'assets/css')))
app.use('/js', express.static(path.resolve(__dirname, 'assets/js')))
app.use('/fonts', express.static(path.resolve(__dirname, 'assets/fonts')))
app.use('/plugins', express.static(path.resolve(__dirname, 'assets/plugins')))
app.use('/scss', express.static(path.resolve(__dirname, 'assets/scss')))
app.use('/webfonts', express.static(path.resolve(__dirname, 'assets/webfonts')))
app.use('/.sass-cache', express.static(path.resolve(__dirname, 'assets/.sass-cache')))

app.get('/', (req, res) => {
    res.render('home')
})
app.get('/login', (req, res) => {
    var userAdded = req.session.userAdded
    req.session.userAdded = ""
    res.render('login', {
        userAdded: userAdded
    })
})
app.get('/register', (req, res) => {
    var wrongPassword = req.session.wrongPassword
    req.session.wrongPassword = ""
    res.render('register', {
        wrongPassword: wrongPassword
    })
})
app.get('/contact', (req, res) => {
    res.render('contact')
})
app.get('/about', (req, res) => {
    res.render('about')
})
app.get('/process', (req, res) => {
    res.render('process')
})
app.get('/hos_login', (req, res) => {
    res.render('hos_login')
})
app.get('/Loginframe', (req, res) => {
    res.render('Loginframe')
})
app.get('/hospitalreg', (req, res) => {
    res.render('hospitalreg')
})
app.get('/Registration', (req, res) => {
    res.render('Registration')
})
app.get('/userlist', (req, res) => {
    const sql = "SELECT * FROM users"
    conn.query(sql, (err, result) => {
        if(!err) {
            res.render('userlist', {userlist: result})
        }
    })
})
app.post('/register', async (req, res) => {
    const {fullName, NID, email, phone, bloodGroup, gender, password, cpassword} = req.body
    const hasedPassword = await bcrypt.hash(password, 10)
    if(password !== cpassword) {
        req.session.wrongPassword = "Password Doesn't Match"
        res.redirect('/register')
    }
    const sql1 = `INSERT INTO users(fullName, NID, email, phone, bloodGroup, gender, password)
                VALUES('${fullName}', '${NID}', '${email}', '${phone}', '${bloodGroup}', '${gender}', '${hasedPassword}')`
    conn.query(sql1, (err, result) => {
        if(!err) {
            req.session.userAdded = "User Added Successfully"
            res.redirect('/login')
        }
    })
})

app.listen(8000, () => {
    console.log("Server Listening At Port 8000")
})