const nodemailer = require('nodemailer');

/**
 * Vercel Serverless Function — POST /api/contact
 * Forwards contact form submissions to ramromatoptvltd@gmail.com
 * via Google SMTP (STARTTLS on port 587).
 *
 * Required environment variables:
 *   GMAIL_USER         — the Gmail address (ramromatoptvltd@gmail.com)
 *   GMAIL_APP_PASSWORD — 16-char App Password from Google Account security
 */
module.exports = async function handler(req, res) {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const { name, email, subject, message } = req.body || {};

  // ── Server-side validation ──────────────────────────────────────────────
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, error: 'All fields are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, error: 'Invalid email address.' });
  }

  // ── Nodemailer transporter ──────────────────────────────────────────────
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // STARTTLS
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  // ── Email to Ramromato ──────────────────────────────────────────────────
  const mailOptions = {
    from: `"Ramromato Contact Form" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    replyTo: `"${name}" <${email}>`,
    subject: `[Contact Form] ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #2D4A2D; padding: 24px 32px;">
          <h2 style="color: #ffffff; margin: 0; font-size: 22px;">New Contact Form Submission</h2>
          <p style="color: #a8c5a0; margin: 4px 0 0; font-size: 14px;">Ramromato Pvt. Ltd. — ramromato.com.np</p>
        </div>
        <div style="padding: 32px; background-color: #ffffff;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; width: 100px; color: #888; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Name</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #222; font-size: 15px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Email</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #222; font-size: 15px;"><a href="mailto:${email}" style="color: #2D4A2D;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Subject</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #222; font-size: 15px;">${subject}</td>
            </tr>
          </table>
          <div style="margin-top: 24px;">
            <p style="color: #888; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Message</p>
            <div style="background-color: #f8f8f8; border-left: 3px solid #2D4A2D; padding: 16px 20px; border-radius: 4px; color: #333; font-size: 15px; line-height: 1.7;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
        </div>
        <div style="background-color: #f5f5f5; padding: 16px 32px; text-align: center; font-size: 12px; color: #aaa;">
          Sent from the contact form at ramromato.com.np · Reply directly to this email to respond to ${name}.
        </div>
      </div>
    `,
  };

  // ── Auto-reply to the sender ────────────────────────────────────────────
  const autoReplyOptions = {
    from: `"Ramromato Pvt. Ltd." <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `Thank you for reaching out — Ramromato Pvt. Ltd.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #2D4A2D; padding: 24px 32px;">
          <h2 style="color: #ffffff; margin: 0; font-size: 22px;">Thank you, ${name}!</h2>
          <p style="color: #a8c5a0; margin: 4px 0 0; font-size: 14px;">We've received your message.</p>
        </div>
        <div style="padding: 32px; background-color: #ffffff;">
          <p style="color: #333; font-size: 15px; line-height: 1.7;">
            Dear ${name},<br><br>
            Thank you for getting in touch with <strong>Ramromato Pvt. Ltd.</strong> We have received your enquiry and our team will get back to you as soon as possible — typically within 1–2 business days.
          </p>
          <div style="background-color: #f8f8f8; border-left: 3px solid #2D4A2D; padding: 16px 20px; border-radius: 4px; margin: 24px 0; color: #555; font-size: 14px; line-height: 1.7;">
            <strong>Your message:</strong><br>
            ${message.replace(/\n/g, '<br>')}
          </div>
          <p style="color: #333; font-size: 15px; line-height: 1.7;">
            In the meantime, feel free to reach us directly:<br>
            📞 <a href="tel:+9779841983765" style="color: #2D4A2D;">+977 984-1983765</a><br>
            📍 Kalopul, Kathmandu, Nepal
          </p>
        </div>
        <div style="background-color: #f5f5f5; padding: 16px 32px; text-align: center; font-size: 12px; color: #aaa;">
          © ${new Date().getFullYear()} Ramromato Pvt. Ltd. · <a href="https://ramromato.com.np" style="color: #888;">ramromato.com.np</a>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(autoReplyOptions);
    return res.status(200).json({ success: true, message: 'Message sent successfully.' });
  } catch (err) {
    console.error('Email send error:', err);
    return res.status(500).json({ success: false, error: 'Failed to send email. Please try again later.' });
  }
};
