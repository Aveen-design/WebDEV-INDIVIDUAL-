const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = async (to, otp) => {
  const mailOptions = {
    from: `"DriveNepal" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your DriveNepal Password Reset Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 2rem; background: #f7f7fa; border-radius: 12px;">
        <h2 style="color: #14213d;">Drive<span style="color:#DC143C;">Nepal</span></h2>
        <p style="color: #444;">You requested to reset your password. Use the code below:</p>
        <div style="background: #fff; border: 2px dashed #DC143C; border-radius: 10px; padding: 1.2rem; text-align: center; margin: 1.5rem 0;">
          <span style="font-size: 2rem; font-weight: 700; letter-spacing: 8px; color: #14213d;">${otp}</span>
        </div>
        <p style="color: #888; font-size: 0.85rem;">This code expires in 10 minutes. If you didn't request this, ignore this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${to}`);
    return true;
  } catch (err) {
    console.error('Email send failed:', err.message);
    console.log(`FALLBACK — OTP for ${to} is: ${otp}`);
    return false;
  }
};

module.exports = { sendOtpEmail };