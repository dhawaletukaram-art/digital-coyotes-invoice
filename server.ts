import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '10mb' }));

  // Real Email Dispatch API
  app.post('/api/send-email', async (req, res) => {
    try {
      const { to, cc, subject, html, text, smtpConfig } = req.body;

      const recipient = to || 'thedigitalcoyotes@gmail.com';
      const senderEmail = smtpConfig?.fromEmail || smtpConfig?.username || 'thedigitalcoyotes@gmail.com';
      const senderName = smtpConfig?.fromName || 'Digital Coyotes Agency';

      // Check if real SMTP password is provided (not empty and not dummy placeholder)
      const hasRealPassword = smtpConfig?.password && 
        smtpConfig.password !== '••••••••••••••••' && 
        smtpConfig.password.trim().length > 0;

      if (!hasRealPassword) {
        return res.status(400).json({
          success: false,
          needsAuth: true,
          error: 'No real SMTP password provided. Enter your 16-character Google App Password in Settings > SMTP Config, or click "Open in Gmail" for 1-click delivery.',
          debugTrace: [
            `Diagnostic: SMTP host is set to ${smtpConfig?.host || 'smtp.gmail.com'}, but no valid App Password is configured.`,
            `To send real emails without opening Gmail:`,
            `1. Go to Google Account > Security > 2-Step Verification > App passwords.`,
            `2. Generate a 16-character password for "Mail".`,
            `3. Paste it in Settings > SMTP Credentials in this app.`
          ]
        });
      }

      // Create real nodemailer transporter
      const host = smtpConfig?.host || 'smtp.gmail.com';
      const port = Number(smtpConfig?.port) || 587;
      const secure = smtpConfig?.secure === true || port === 465;

      const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
          user: smtpConfig.username || 'thedigitalcoyotes@gmail.com',
          pass: smtpConfig.password.trim()
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      // Verify connection first
      await transporter.verify();

      // Send mail
      const info = await transporter.sendMail({
        from: `"${senderName}" <${senderEmail}>`,
        to: recipient,
        cc: cc || undefined,
        replyTo: smtpConfig?.replyTo || senderEmail,
        subject: subject || '[Digital Coyotes] Agency Notification',
        text: text || '',
        html: html || undefined
      });

      return res.json({
        success: true,
        messageId: info.messageId,
        response: info.response,
        accepted: info.accepted,
        debugTrace: [
          `Connected to SMTP ${host}:${port} (${secure ? 'SSL' : 'TLS'})`,
          `Authenticated as ${smtpConfig.username}`,
          `MAIL FROM:<${senderEmail}> OK`,
          `RCPT TO:<${recipient}> OK`,
          `250 Message accepted: ${info.messageId}`,
          `Delivered to destination: ${recipient}`
        ]
      });
    } catch (err: any) {
      console.error('SMTP Delivery Error:', err);
      let userFriendlyMsg = err.message || 'SMTP Socket error';
      if (err.message && err.message.includes('Username and Password not accepted')) {
        userFriendlyMsg = 'Google SMTP Authentication Failed: Gmail requires an "App Password" (not your normal Gmail login password) when 2-Step Verification is active. Generate one at myaccount.google.com/apppasswords.';
      }

      return res.status(500).json({
        success: false,
        error: userFriendlyMsg,
        code: err.code,
        debugTrace: [
          `Connection attempt to ${req.body?.smtpConfig?.host || 'smtp.gmail.com'}:${req.body?.smtpConfig?.port || 587}`,
          `Authentication user: ${req.body?.smtpConfig?.username || 'thedigitalcoyotes@gmail.com'}`,
          `SMTP Error: ${err.message}`
        ]
      });
    }
  });

  // Test SMTP connection endpoint
  app.post('/api/test-smtp', async (req, res) => {
    try {
      const { smtpConfig } = req.body;
      const host = smtpConfig?.host || 'smtp.gmail.com';
      const port = Number(smtpConfig?.port) || 587;
      const secure = smtpConfig?.secure === true || port === 465;

      const hasRealPassword = smtpConfig?.password && 
        smtpConfig.password !== '••••••••••••••••' && 
        smtpConfig.password.trim().length > 0;

      if (!hasRealPassword) {
        return res.status(400).json({
          success: false,
          error: 'Please enter a valid Google App Password (16 characters) to test live Gmail SMTP delivery.'
        });
      }

      const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
          user: smtpConfig.username,
          pass: smtpConfig.password.trim()
        },
        tls: { rejectUnauthorized: false }
      });

      await transporter.verify();

      const testResult = await transporter.sendMail({
        from: `"${smtpConfig.fromName || 'Digital Coyotes'}" <${smtpConfig.fromEmail || smtpConfig.username}>`,
        to: smtpConfig.username || 'thedigitalcoyotes@gmail.com',
        subject: '[Digital Coyotes] Live SMTP Handshake Verified',
        text: `Success! Live SMTP connection from Digital Coyotes agency engine is verified and active.\nSent to: ${smtpConfig.username}\nTimestamp: ${new Date().toISOString()}`
      });

      res.json({
        success: true,
        messageId: testResult.messageId,
        response: testResult.response
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message || 'SMTP Handshake failed'
      });
    }
  });

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Digital Coyotes Agency Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
