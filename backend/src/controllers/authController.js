// backend/src/controllers/authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/client.js';

export async function registerUser(req, res) {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: role || 'author',
      },
    });

    return res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, username: user.username },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error.' });
  }
}

export async function loginUser(req, res) {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
}

export async function getProfile(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, username: true, role: true },
    });
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error.' });
  }
}
