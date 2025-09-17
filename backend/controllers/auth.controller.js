const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Helper: government email test
const isGovernmentEmail = (email) => {
  if (!email) return false;
  const domain = (process.env.GOV_EMAIL_DOMAIN || 'gov.in').toLowerCase();
  const allow = (process.env.GOV_ALLOWED_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const e = email.toLowerCase();
  return allow.includes(e) || e.endsWith(`@${domain}`);
};

// Helper: JWT
const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'dev-insecure-secret-change-me';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(
    { id: user._id, role: user.role },
    secret,
    { expiresIn }
  );
};

module.exports = {
  // Register a new user (citizen or government official)
  register: async (req, res) => {
    try {
      console.log('Register request body:', req.body);

      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, phone, password, role, department, location } = req.body;

      // Check if user already exists
      let existingUser = await User.findOne({
        $or: [
          { email },
          { phone }
        ]
      });

      if (existingUser) {
        return res.status(400).json({
          message: 'User already exists with this email or phone number'
        });
      }

      // Create new user
      const user = new User({
        name,
        email,
        phone,
        password,
        role: role || 'citizen',
        department: department || undefined,
        location,
        isVerified: true // For simplicity, auto-verify users
      });

      await user.save();

      // Generate token
      const token = generateToken(user);

      // Return user info without password
      const userResponse = { ...user.toObject() };
      delete userResponse.password;

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: userResponse
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server error during registration' });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      console.log('Login request body:', req.body);

      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, phone, password } = req.body;

      // Check if user exists
      let user;
      if (email) {
        user = await User.findOne({ email });
      } else if (phone) {
        user = await User.findOne({ phone });
      } else {
        return res.status(400).json({ message: 'Please provide email or phone number' });
      }

      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Generate token
      const token = generateToken(user);

      // Return user info without password
      const userResponse = { ...user.toObject() };
      delete userResponse.password;

      res.json({
        message: 'Login successful',
        token,
        user: userResponse
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error during login' });
    }
  },

  // Get current user profile
  getCurrentUser: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: 'Server error while fetching user' });
    }
  },

  // Update user profile
  updateProfile: async (req, res) => {
    try {
      const { name, location, preferredLanguage, darkMode } = req.body;

      // Find user and update profile
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update fields if provided
      if (name) user.name = name;
      if (location) user.location = location;
      if (preferredLanguage) user.preferredLanguage = preferredLanguage;
      if (darkMode !== undefined) user.darkMode = darkMode;

      // If profile picture was uploaded
      if (req.file) {
        user.profilePicture = `/uploads/images/${req.file.filename}`;
      }

      await user.save();

      // Return updated user without password
      const updatedUser = { ...user.toObject() };
      delete updatedUser.password;

      res.json({
        message: 'Profile updated successfully',
        user: updatedUser
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ message: 'Server error while updating profile' });
    }
  },

  // Change password
  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      // Find user
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check current password
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ message: 'Server error while changing password' });
    }
  }
};
