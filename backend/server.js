
const express = require('express');
const cors = require('cors');
const pool = require('./db.js');
const authRoutes = require('./routes/auth')
const authorize = require('./middleware/authorize')

const app = express();
app.use(cors());
app.use(express.json());



app.get('/todos', authorize, async(req, res)=>{
    try{
    const result = await pool.query('SELECT * FROM todos WHERE user_id = $1 ORDER BY id ASC',
        [req.user.id]
    );
    res.json(result.rows);
    } catch (err) {
        res.status(500).send(err.message)
    }
});

app.post('/todos', authorize, async(req, res)=>{
    try{
        const {text, time} = req.body;
        const result = await pool.query(
            'INSERT INTO todos (text, time, user_id) VALUES ($1, $2, $3) RETURNING *',
            [text, time, req.user.id]
        );
        res.json(result.rows[0]);
    } catch (err){
        res.status(500).send(err.message)
    }
});

app.delete('/todos/:id', async(req, res)=>{
    try{
    const {id} = req.params;
    await pool.query('DELETE FROM todos WHERE id = $1', [id]);
    res.json("Deleted successfully")
}catch(err){
    console.error(err.message);
    res.status(500).json({error: "Server error during deletion"});
}
})

app.get('/todos', authorize, async (req, res)=>{
    try {
        const result = await pool.query(
            'SELECT * FROM todos WHERE user_id = $1 ORDER BY id ASC',
            [req.user.id]
        )
        res.json(result.rows)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

app.use('/auth',authRoutes)
app.listen(5000, ()=> console.log("Server is running"))