const bcrypt = require('bcryptjs');
const userModel = require('../model/userModel');
const { sendOtpEmail } = require('../service/emailService');

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const requestReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await userModel.findUserByEmail(email);

    if (user && user.password_hash) {
      const otp = generateOtp();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await userModel.saveOtp(email, otp, expiresAt);
      await sendOtpEmail(email, otp);
    }

    res.status(200).json({
      success: true,
      message: 'If an account exists for this email, a reset code has been sent.',
    });
  } catch (err) {
    console.error('Request reset error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and code are required' });
    }

    const record = await userModel.findValidOtp(email, otp);
    if (!record) {
      return res.status(400).json({ success: false, message: 'Invalid or expired code' });
    }

    res.status(200).json({ success: true, message: 'Code verified' });
  } catch (err) {
    console.error('Verify OTP error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, new_password } = req.body;
    if (!email || !otp || !new_password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    if (new_password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    const record = await userModel.findValidOtp(email, otp);
    if (!record) {
      return res.status(400).json({ success: false, message: 'Invalid or expired code' });
    }

    const hash = await bcrypt.hash(new_password, 10);
    await userModel.updatePassword(email, hash);
    await userModel.markOtpUsed(record.id);

    res.status(200).json({ success: true, message: 'Password reset successfully. You can now log in.' });
  } catch (err) {
    console.error('Reset password error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { requestReset, verifyOtp, resetPassword };