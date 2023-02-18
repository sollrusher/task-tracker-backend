const { Router } = require('express')
const { Task, User, Estimates } = require('../models')

const router = Router()

router.get('/', async (req, res) => {
  const token = req.headers.authorization
  if (req.query.id) {
    const task = await Task.findOne({
      where: { id: req.query.id },
      include: [
        { model: User },
        { model: Estimates, include: [{ model: User }] },
      ],
    })
    if (!task) {
      res.status(400).json({ message: 'Not found' })
      return
    }
    const response = task.toJSON()
    if (task.Estimates?.length) {
      const averageEstimate =
        task.Estimates.reduce((acc, item) => {
          return (acc += item.estimate)
        }, 0) / task.Estimates.length
      response.average_estimate = averageEstimate.toFixed(1)
      if (!task.Estimates.find((item) => item.user_id == token)) {
        delete response.Estimates
      }
    } else {
      delete response.Estimates
    }
    res.status(200).json(response)
    return
  }
  const tasks = await Task.findAll({
    include: [{ model: User }],
  })
  res.status(200).json(tasks)
})

router.post('/', async (req, res) => {
  const { body } = req
  const token = req.headers.authorization
  const newTaskBody = {
    title: body.title,
    created_by: token,
    status: body.status || 0,
  }
  if (body.description) newTaskBody.description = body.description
  try {
    const newTask = await Task.create(newTaskBody)
    res.status(200).json(newTask)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
})

router.patch('/', async (req, res) => {
  const { title, description, status, id } = req.body
  try {
    await Task.update(
      { title, description, status },
      { where: { id }, returning: true, plain: true }
    )
    const updatedTask = await Task.findOne({ where: { id } })
    res.status(200).json(updatedTask)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

router.post('/estimate', async (req, res) => {
  const { task_id, estimate } = req.body
  const user_id = req.headers.authorization
  try {
    const newEstimate = await Estimates.create({ task_id, user_id, estimate })
    const allEstimates = await Estimates.findAll({
      where: { task_id },
      include: [{ model: User }],
    })
    const averageEstimate =
      allEstimates.reduce((acc, item) => {
        return (acc += item.estimate)
      }, 0) / allEstimates.length
    res.status(200).json({
      estimates: allEstimates,
      average_estimate: averageEstimate.toFixed(1),
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong' })
  }

  res.status(200).json()
})

module.exports = router
