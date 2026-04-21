const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

async function testEmail() {
  console.log('Starting local email test...');

  // Parse .env manually so we don't need the dotenv package
  const envPath = path.join(__dirname, '../.env');
  let user = '';
  let pass = '';

  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    for (const line of lines) {
      if (line.startsWith('GMAIL_USER=')) {
        user = line.replace('GMAIL_USER=', '').trim();
      } else if (line.startsWith('GMAIL_APP_PASSWORD=')) {
        pass = line.replace('GMAIL_APP_PASSWORD=', '').trim().replace(/\s/g, '');
      }
    }
  } catch (err) {
    console.error('❌ Could not read .env file. Make sure it exists in the project root.');
    return;
  }

  console.log(`User: ${user}`);
  console.log(`Password length: ${pass ? pass.length : 0}`);

  if (!user || user.includes('xxx') || !pass || pass.includes('xxxx')) {
    console.error('❌ Missing or placeholder values in .env. Please add real credentials.');
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
