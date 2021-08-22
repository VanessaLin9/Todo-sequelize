const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const bcrypt = require('bcryptjs')
const session = require('express-session')
const usePassport = require('./config/passport') //載入一包 Passport 設定檔
// 引用 passport，放在文件上方
const passport = require('passport') //把 Passport 套件本身載入進來

const db = require('./models')
const Todo = db.Todo
const User = db.User

const app = express()
const PORT = 3000
const routes = require('./routes')

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
usePassport(app)

// 加入 middleware，驗證 reqest 登入狀態
app.post('/users/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
})) //Passport 套件功能

app.use(routes)



app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})