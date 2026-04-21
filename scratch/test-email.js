require('dotenv').config({ path: '.env' });
const nodemailer = require('nodemailer');

async function testEmail() {
  const user = (process.env.GMAIL_USER || '').trim();
  const pass = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s/g, '');

  console.log(`Starting local email test...`);
  console.log(`User: ${user}`);
  console.log(`Password length: ${pass.length}`);

  if (!user || !pass) {
    console.error('Missing GMAIL_USER or GMAIL_APP_PASSWORD in .env file.');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: user,
      pass: pass,
    },
  });

  try {
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!');
    
    // Attempt to send a test email to itself
    const mailOptions = {
      from: user,
      to: user,
      subject: 'Local Test Email',
      text: 'This is a test email from your local environment.',
    };
    
    console.log('Sending test email...');
    let res = await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent! Message ID:', res.messageId);
  } catch (err) {
    console.error('❌ Failed:', err.message, '| Code:', err.code);
  }
}

testEmail();
