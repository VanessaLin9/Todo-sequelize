const express = require('express')
const router = express.Router()
// 引用 Todo model
const db = require('../../models')
const Todo = db.Todo
const User = db.User

//新增
router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/', (req, res) => {
  const UserId = req.user.id
  const name = req.body.name 
  return Todo.create({ name, UserId }) //存入資料庫
    .then(() => res.redirect('/')) //新增完成後導回首頁
    .catch(error => console.log(error))
})

//查看

router.get('/:id', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id)
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(error => console.log(error))
})  

//編輯

router.get('/:id/edit', (req, res) => {
  const UserId = req.user.id
  const id = req.params.id
  const name = req.body.name
  return Todo.findOne({ 
    where: {id} 
  })
    .then((todo) => { 
      console.log(UserId)
      console.log(todo.toJSON())
      return res.render('edit', { todo: todo.toJSON()}) })
    .catch(error => { return res.status(422).json(error) })
})

router.put('/:id', (req, res) => {
  const userId = req.user.id
  const id = req.params.id
  const { name, isDone } = req.body
  return Todo.findAll({
     where: { id, userId }
    })
    .then(todo => {
      todo.name = name
      todo.isDone = isDone === 'on'
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(error => console.log(error))
})

//刪除


module.exports = router