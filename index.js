const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3001; // Change this to any available port

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/registrationDB')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));

// User schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema);

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/', async (req, res) => {
    if (req.body.register) {
        // Handle registration
        try {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });

            await newUser.save();
            res.send('User registered successfully!');
        } catch (err) {
            res.status(500).send('Error occurred while saving the user.');
        }
    } else if (req.body.login) {
        // Handle login
        try {
            const user = await User.findOne({ email: req.body.email, password: req.body.password });
            if (user) {
                res.send('Login successful!');
            } else {
                res.send('Invalid email or password.');
            }
        } catch (err) {
            res.status(500).send('Error occurred while logging in.');
        }
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
