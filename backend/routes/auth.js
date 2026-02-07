const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../db');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

router.post('/register', async (req, res)=>{
    try{
        const {username, email, password} = req.body;

        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length !== 0) return res.status(401).send("User already exists");

        const salt = await bcrypt.genSalt(10);
        const bcryptPassword = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
            [username, email, bcryptPassword]
        );

        res.json({message: "User registered successfully"})

    } catch (err){
        console.error(err.message);
        res.status(500).send("Server Error")
    }
})

router.post('/login', async (req, res)=>{
    const {email, password} = req.body;
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (user.rows.length === 0) return res.status(401).json({message:"Invalid Email"});

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) return res.status(401).json({message:"Invalid Password"});

    const token = jwt.sign(
        {id: user.rows[0].id, role: user.rows[0].role},
        process.env.JWT_SECRET,
        {expiresIn: "1h"}
    );

    res.json({token, username: user.rows[0].username})
})

router.post('/forgot-password', async (req, res)=>{
    const{email}=req.body;
    try {
        const user = await pool.query("SELECT * FROM users WHERE email = $1",[email]);

        if(user.rows.length === 0) {
            return res.status(404).json({message: "Email does not exist"});
        }

        const resetToken = crypto.randomBytes(32).toString('hex')
        const expiry = Date.now() + 3600000;

        await pool.query(
            "UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3",
            [resetToken, expiry, email]
        )

        const resetUrl = `${process.env.RESET_URL}/${resetToken}`

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            html: `<h3>You requested a password reset</h3>
            <p>Click this <a href="${resetUrl}">Link</a> to reset your password.</p>
            <p>This link expires in 1 hour.</p>`
        }

        await transporter.sendMail(mailOptions);
        res.json({message: "Reset link is sent to your email"})
        
    } catch (err) {
        console.error(err)
        res.status(500).json({message: "Server error"})
    }
})

router.post('/reset-password/:token', async (req, res) =>{
    const {token} = req.params;
    const {password} = req.body;

    try {
        const user = await pool.query(
            "SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiry> $2",
            [token, Date.now()]
        );

        if (user.rows.length === 0) {
            return res.status(400).json({message: "Invalid or expired token"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await pool.query(
            "UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2",
            [hashedPassword, user.rows[0].id]
        );
        res.json({message: "Password reset successful"})
    } catch (err) {
        console.error(err);
        res.status(500).json({message:"Server errror"})
        
    }
})

module.exports = router;