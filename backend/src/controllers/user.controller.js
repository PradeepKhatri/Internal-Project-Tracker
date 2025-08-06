import User from '../models/User.model.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'EmaarIndia';

const UserLogin = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !email.includes('@emaar.ae')) {
            return res.status(400).json({ message: 'You need access to Login' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(403).json({ message: 'Access denied. You need access.' });
        }

        const payload = {
            id: user._id,
            email: user.email,
            role: user.role,
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

        return res.status(200).json({
            message: 'Login successful',
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const CreateUser = async (req, res) => {
    try {
        const { name, email, role } = req.body;

        if (!name || !email || !role) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists with this email.' });
        }

        const newUser = new User({
            name,
            email,
            role
        });

        await newUser.save();

        return res.status(201).json({
            message: 'User created successfully',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error('CreateUser error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export { UserLogin, CreateUser };