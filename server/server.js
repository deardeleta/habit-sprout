const PORT = process.env.PORT ?? 8000
const express = require('express')
const { v4: uuidv4} = require('uuid')
const cors = require('cors')
const app = express()
const pool = require('./db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

app.use(cors())
app.use(express.json())

// get all habits
app.get('/habits/:userEmail', async (req, res) => {
  const { userEmail } = req.params
  console.log(userEmail)
  try {
    const habits = await pool.query('SELECT * FROM habits WHERE user_email = $1', [userEmail])
    res.json(habits.rows)
  } catch (err) {
    console.error(err)
  }
})

// create a new habit
app.post('/habits', async(req, res) =>{
  const { user_email, title, progress, date } = req.body
  console.log(user_email, title, progress, date)
  const id = uuidv4()
  try {
    const newHabit = await pool.query(`INSERT INTO habits(id, user_email, title, progress, date) VALUES($1, $2, $3, $4, $5)`,
      [id, user_email, title, progress, date])
      res.json(newHabit)
  } catch (err) {
    console.error(err)
  }

})

// edit a habit
app.put('/habits/:id', async (req, res) => {
  const { id } = req.params;
  let { user_email, title, progress, date } = req.body;

  console.log('--- PUT REQUEST RECEIVED ---');
  console.log('Habit ID:', id);
  console.log('Request Body:', req.body);


  // Sanitize the date in case it's a raw JS Date object
  if (typeof date === 'object' && date !== null) {
    try {
      date = new Date(date).toISOString().split('T')[0]; // format: YYYY-MM-DD
    } catch (err) {
      return res.status(400).json({ error: 'Invalid date format' });
    }
  }

  try {
    const editHabit = await pool.query(
      'UPDATE habits SET user_email = $1, title = $2, progress = $3, date = $4 WHERE id = $5;',
      [user_email, title, progress, date, id]
    );

    // return 404 if no rows were updated
    if (editHabit.rowCount === 0) {
      return res.status(404).json({ error: 'Habit not found or update failed' });
    }

    res.status(200).json({ message: 'Habit updated successfully' });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Database update failed' });
  }
});

// delete a habit
app.delete('/habits/:id', async (req, res) => {
  const { id } = req.params
  try {
    const deleteHabit = await pool.query('DELETE FROM habits WHERE id = $1;', [id])
    res.json(deleteHabit)
  } catch (err) {
    console.error(err)
  }
})

//signup
app.post('/signup', async (req, res) => {
  const {email, password} = req.body
  const salt = bcrypt.genSaltSync(10)
const hashPassword = bcrypt.hashSync(password, salt)

  try {
    const signUp = await pool.query(`INSERT INTO users (email, hashed_password) VALUES($1, $2)`,
      [email, hashPassword])

      const token = jwt.sign({email}, 'secret', {expiresIn: '1hr'})

      res.json({email, token})

  } catch (err) {
    console.error(err)
    if(err) {
      res.json({detail: err.detail})
    }
  }
})

//login
app.post('/login', async (req, res) => {
  const {email, password} = req.body
  try {
const users = await pool.query('SELECT * FROM users WHERE email = $1', [email])
  if (!users.rows.length) return res.json({ detail: 'User does not exist!'})

  const success = await bcrypt.compare(password, users.rows[0].hashed_password)
  const token = jwt.sign({email}, 'secret', {expiresIn: '1hr'})

  if (success) {
    res.json({'email' : users.rows[0].email, token})
  } else {
    res.json({ detail: 'Login failed'})
  }

} catch (err) {
    console.error(err)
  }
})

app.listen(PORT, ( )=> console.log(`Server running on PORT ${PORT}`))