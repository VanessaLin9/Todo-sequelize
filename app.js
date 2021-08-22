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

app.get('/', (req, res) => {
  return Todo.findAll({
    raw: true,
    nest: true
  })
    .then((todos) => { return res.render('index', { todos: todos }) })
    .catch((error) => { return res.status(422).json(error) })
})

app.get('/users/login', (req, res) => {
  res.render('login')
})

app.post('/users/login', (req, res) => {
  res.send('login')
})

app.get('/users/register', (req, res) => {
  res.render('register')
})

app.post('/users/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  User.findOne({ where: { email } }).then(user => {
    if (user) {
      console.log('User already exists')
      return res.render('register', {
        name,
        email,
        password,
        confirmPassword
      })
    }
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
  })
})

app.get('/users/logout', (req, res) => {
  res.send('logout')
})

app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id)
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(error => console.log(error))
})

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})