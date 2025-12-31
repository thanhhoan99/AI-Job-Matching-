import nodemailer from 'nodemailer'

// Tạo transporter cho Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER || 'thanhhoan7878647@gmail.com',
    pass: process.env.SMTP_PASSWORD, // App password 16 ký tự từ Google
  },
})

// Kiểm tra kết nối
transporter.verify((error) => {
  if (error) {
    console.error('SMTP Connection Error:', error)
  } else {
    console.log('✅ SMTP Server is ready to send emails')
  }
})

export default transporter