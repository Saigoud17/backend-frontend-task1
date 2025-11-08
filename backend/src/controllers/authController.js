const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { User } = require('../models');

const register = async(req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const existing = await User.findOne({ where: { email } });
        if (existing) return res.status(400).json({ error: 'Email already registered' });

        const hash = await bcrypt.hash(password, Number(process.env.BCRYPT_ROUNDS) || 10);
        const user = await User.create({ name, email, password_hash: hash, role: role || 'user' });

        res.status(201).json({ message: 'User registered successfully', user: user.toJSON() });
    } catch (err) {
        next(err);
    }
};

const login = async(req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const valid = await user.verifyPassword(password);
        if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, role: user.role }, // ✅ change 'sub' → 'id'
            process.env.JWT_SECRET, { expiresIn: '2h' }
        );
        res.json({ message: 'Login successful', token, user: user.toJSON() });
    } catch (err) {
        next(err);
    }
};

module.exports = { register, login };