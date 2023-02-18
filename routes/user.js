const { Router } = require('express')
const { User } = require('../models')

const router = Router()

router.get('/', async (req, res) => {
  const users = await User.findAll()
  res.status(200).json(users)
})

router.post('/login', async (req, res) => {
  const { login, password } = req.body
  try {
    const user = await User.findOne({ where: { login, password } })
    if (!user) {
      res.status(404).json({ message: 'Такого человека нет' })
      return
    }
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: 'Что-то пошло не так' })
  }
})

router.post('/register', async (req, res) => {
  const { firstName, lastName, login, password } = req.body
  if (!firstName || !lastName || !login || !password) {
    res.status(400).json({ message: 'Неполные данные' })
    return
  }
  try {
    const user = await User.create({ firstName, lastName, login, password })
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: 'Что-то пошло не так' })
  }
})


module.exports = router
