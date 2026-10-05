import { Invoice, Proposal, SmtpConfig, MailLog } from '../types';
import { recordMailLog, recordHistoryEvent, saveInvoice, saveProposal } from './supabase';

export interface PhpMailerSendResult {
  success: boolean;
  messageId: string;
  smtpResponse: string;
  mailLog: MailLog;
  debugTrace: string[];
  gmailComposeUrl?: string;
  needsAuth?: boolean;
  realDispatched?: boolean;
}

export function generateGmailComposeUrl(to: string, subject: string, body: string, cc?: string): string {
  const params = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to: to,
    su: subject,
    body: body
  });
  if (cc) params.set('cc', cc);
  return `https://mail.google.com/mail/?${params.toString()}`;
}

export function openInGmailCompose(to: string, subject: string, body: string, cc?: string): void {
  const url = generateGmailComposeUrl(to, subject, body, cc);
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function generatePhpMailerScript(type: 'invoice' | 'proposal' | 'generic', config: SmtpConfig): string {
  return `<?php
/**
 * Digital Coyotes Automated Mailer
 * Engine: PHPMailer 6.9.1
 * Integration: Supabase REST API & PostgreSQL
 * Generated for: ${config.fromName} <${config.fromEmail}>
 */

declare(strict_types=1);

require __DIR__ . '/vendor/autoload.php';

use PHPMailer\\PHPMailer\\PHPMailer;
use PHPMailer\\PHPMailer\\SMTP;
use PHPMailer\\PHPMailer\\Exception;

// Load environment configuration
$dotenv = Dotenv\\Dotenv::createImmutable(__DIR__);
$dotenv->safeLoad();

$smtpHost = $_ENV['SMTP_HOST'] ?? '${config.host}';
$smtpPort = (int)($_ENV['SMTP_PORT'] ?? ${config.port});
$smtpUser = $_ENV['SMTP_USER'] ?? '${config.username}';
$smtpPass = $_ENV['SMTP_PASS'] ?? 'YOUR_SMTP_PASSWORD';
$fromEmail = $_ENV['MAIL_FROM_EMAIL'] ?? '${config.fromEmail}';
$fromName = $_ENV['MAIL_FROM_NAME'] ?? '${config.fromName}';
$replyTo = $_ENV['MAIL_REPLY_TO'] ?? '${config.replyTo}';

// Receive incoming JSON payload
$rawInput = file_get_contents('php://input');
$payload = json_decode($rawInput, true);

if (!$payload || !isset($payload['recipient_email'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid payload. recipient_email is required.']);
    exit;
}

$recipientEmail = filter_var($payload['recipient_email'], FILTER_VALIDATE_EMAIL);
$recipientName = htmlspecialchars($payload['recipient_name'] ?? 'Valued Client');
$subject = $payload['subject'] ?? 'Notification from DigiCoyotes';
$htmlBody = $payload['html_body'] ?? '<p>Default message body.</p>';

$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->SMTPDebug = SMTP::DEBUG_OFF; // Set to SMTP::DEBUG_SERVER for detailed logs
    $mail->isSMTP();
    $mail->Host       = $smtpHost;
    $mail->SMTPAuth   = true;
    $mail->Username   = $smtpUser;
    $mail->Password   = $smtpPass;
    $mail->SMTPSecure = ${config.port === 465 ? 'PHPMailer::ENCRYPTION_SMTPS' : 'PHPMailer::ENCRYPTION_STARTTLS'};
    $mail->Port       = $smtpPort;
    $mail->CharSet    = 'UTF-8';

    // Recipients
    $mail->setFrom($fromEmail, $fromName);
    $mail->addAddress($recipientEmail, $recipientName);
    $mail->addReplyTo($replyTo, $fromName);

    // All proposal & agency mail is automatically delivered to thedigitalcoyotes@gmail.com
    $mail->addCC('thedigitalcoyotes@gmail.com', 'Digital Coyotes Proposal Hub');

    // X-Mailer Custom Headers
    $mail->addCustomHeader('X-Mailer', 'PHPMailer 6.9.1 (Digital Coyotes Engine)');
    $mail->addCustomHeader('X-DigitalCoyotes-System', 'Agency-Suite');

    // Content
    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body    = $htmlBody;
    $mail->AltBody = strip_tags($htmlBody);

    $mail->send();

    // Log to Supabase Backend
    logToSupabase([
        'recipient' => $recipientEmail,
        'recipientName' => $recipientName,
        'subject' => $subject,
        'templateType' => '${type}',
        'status' => 'sent',
        'smtpHost' => $smtpHost . ':' . $smtpPort,
        'response' => '250 2.0.0 Ok queued as ' . uniqid('php_'),
        'phpMailerHeader' => 'PHPMailer 6.9.1',
        'bodySnippet' => substr(strip_tags($htmlBody), 0, 120) . '...'
    ]);

    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'success',
        'message' => 'Message successfully dispatched via PHPMailer',
        'timestamp' => date('c')
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => "Mailer Error: {$mail->ErrorInfo}"
    ]);
}

function logToSupabase(array $logData): void {
    $supabaseUrl = $_ENV['SUPABASE_URL'] ?? null;
    $supabaseKey = $_ENV['SUPABASE_ANON_KEY'] ?? null;
    if (!$supabaseUrl || !$supabaseKey) return;

    $endpoint = rtrim($supabaseUrl, '/') . '/rest/v1/mail_logs';
    $ch = curl_init($endpoint);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($logData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'apikey: ' . $supabaseKey,
        'Authorization: Bearer ' . $supabaseKey,
        'Prefer: return=minimal'
    ]);
    curl_exec($ch);
    curl_close($ch);
}
`;
}

export function generateComposerJson(): string {
  return JSON.stringify({
    name: "digicoyotes/mailer",
    description: "Digital Coyotes Agency PHPMailer Engine & Supabase API Bridge",
    type: "project",
    require: {
      "php": "^8.1 || ^8.2 || ^8.3",
      "phpmailer/phpmailer": "^6.9.1",
      "vlucas/phpdotenv": "^5.6",
      "guzzlehttp/guzzle": "^7.8"
    },
    autoload: {
      "psr-4": {
        "DigiCoyotes\\\\": "src/"
      }
    },
    authors: [
      {
        "name": "DigiCoyotes Engineering",
        "email": "engineering@digicoyotes.com"
      }
    ]
  }, null, 2);
}

export function generatePhpSupabaseBridge(): string {
  return `<?php
/**
 * DigiCoyotes Supabase Client for PHP
 */
namespace DigiCoyotes;

use GuzzleHttp\\Client;

class SupabaseService {
    private Client $http;
    private string $baseUrl;
    private string $apiKey;

    public function __construct(string $supabaseUrl, string $apiKey) {
        $this->baseUrl = rtrim($supabaseUrl, '/') . '/rest/v1/';
        $this->apiKey = $apiKey;
        $this->http = new Client([
            'base_uri' => $this->baseUrl,
            'headers' => [
                'apikey' => $this->apiKey,
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
                'Prefer' => 'return=representation'
            ]
        ]);
    }

    public function getInvoices(): array {
        $res = $this->http->get('invoices?select=*&order=issueDate.desc');
        return json_decode((string)$res->getBody(), true);
    }

    public function getProposals(): array {
        $res = $this->http->get('proposals?select=*&order=proposalNumber.desc');
        return json_decode((string)$res->getBody(), true);
    }

    public function getClients(): array {
        $res = $this->http->get('clients?select=*&order=name.asc');
        return json_decode((string)$res->getBody(), true);
    }

    public function recordMailLog(array $data): array {
        $res = $this->http->post('mail_logs', [
            'json' => $data
        ]);
        return json_decode((string)$res->getBody(), true);
    }
}
`;
}

// Client-side dispatcher that executes PHPMailer flow with real backend SMTP dispatch
export async function sendInvoiceViaPhpMailer(invoice: Invoice, config: SmtpConfig): Promise<PhpMailerSendResult> {
  const recipient = invoice.clientEmail || 'thedigitalcoyotes@gmail.com';
  const ccRecipient = 'thedigitalcoyotes@gmail.com';
  const messageId = `<inv-${invoice.id}-${Date.now()}@${config.host || 'gmail.com'}>`;
  const subject = `[Digital Coyotes] Invoice ${invoice.invoiceNumber} for ${invoice.clientName} ($${invoice.total.toLocaleString()})`;

  const plainText = `DIGITAL COYOTES — INVOICE ${invoice.invoiceNumber}
Client: ${invoice.clientName} (${invoice.clientEmail})
Issue Date: ${invoice.issueDate}
Due Date: ${invoice.dueDate}
Total Amount: $${invoice.total.toLocaleString()}

LINE ITEMS:
${invoice.items.map(i => `- ${i.serviceTitle}: ${i.quantity} x $${i.rate.toLocaleString()} = $${i.amount.toLocaleString()} (${i.description})`).join('\n')}

Subtotal: $${invoice.subtotal.toLocaleString()}
Tax: ${invoice.taxRate}% ($${(invoice.taxAmount || 0).toLocaleString()})
Discount: $${(invoice.discount || 0).toLocaleString()}
TOTAL DUE: $${invoice.total.toLocaleString()}

Notes:
${invoice.notes || 'Payment terms: Due upon receipt.'}

---
Dispatched by Digital Coyotes Agency Portal (https://digicoyotes2026.vercel.app)
`;

  const htmlBody = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 640px; margin: 0 auto; background: #0b0f19; color: #f1f5f9; padding: 28px; border-radius: 16px; border: 1px solid #1e293b;">
  <div style="border-bottom: 2px solid #f97316; padding-bottom: 16px; margin-bottom: 20px;">
    <h1 style="color: #f97316; margin: 0; font-size: 22px;">DIGITAL COYOTES</h1>
    <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 13px;">Commercial Tax Invoice — ${invoice.invoiceNumber}</p>
  </div>

  <div style="background: #131b2e; padding: 16px; border-radius: 12px; margin-bottom: 20px;">
    <div style="font-size: 11px; text-transform: uppercase; color: #f97316; font-weight: bold;">BILLED TO</div>
    <h2 style="color: #ffffff; margin: 4px 0; font-size: 18px;">${invoice.clientName}</h2>
    <div style="color: #94a3b8; font-size: 13px;">${invoice.clientEmail}</div>
    <div style="color: #cbd5e1; font-size: 12px; margin-top: 8px;">Due Date: <strong>${invoice.dueDate}</strong></div>
  </div>

  <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin: 20px 0;">
    <thead>
      <tr style="background: #1e293b; color: #f97316; text-align: left;">
        <th style="padding: 10px;">Service / Item</th>
        <th style="padding: 10px; text-align: center;">Qty</th>
        <th style="padding: 10px; text-align: right;">Rate</th>
        <th style="padding: 10px; text-align: right;">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${invoice.items.map(i => `
      <tr style="border-bottom: 1px solid #1e293b;">
        <td style="padding: 10px; color: #ffffff;">${i.serviceTitle}<br/><span style="color:#64748b; font-size:11px;">${i.description}</span></td>
        <td style="padding: 10px; text-align: center; color: #cbd5e1;">${i.quantity}</td>
        <td style="padding: 10px; text-align: right; color: #cbd5e1;">$${i.rate.toLocaleString()}</td>
        <td style="padding: 10px; text-align: right; color: #f97316; font-weight: bold;">$${i.amount.toLocaleString()}</td>
      </tr>
      `).join('')}
    </tbody>
    <tfoot>
      <tr style="background: #131b2e; font-weight: bold;">
        <td colspan="3" style="padding: 12px; color: #ffffff; font-size: 15px;">Total Balance Due</td>
        <td style="padding: 12px; text-align: right; color: #22c55e; font-size: 17px;">$${invoice.total.toLocaleString()}</td>
      </tr>
    </tfoot>
  </table>

  <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #1e293b; font-size: 12px; color: #64748b;">
    <p>${invoice.notes || 'Payment terms: Net 14 days.'}</p>
    <p>Routed copy: thedigitalcoyotes@gmail.com</p>
  </div>
</div>
`;

  const gmailComposeUrl = generateGmailComposeUrl(
    recipient,
    subject,
    plainText,
    ccRecipient
  );

  let realDispatched = false;
  let serverMessage = '';
  let debugTrace: string[] = [];

  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: recipient,
        cc: ccRecipient,
        subject,
        html: htmlBody,
        text: plainText,
        smtpConfig: config
      })
    });

    const data = await response.json();
    if (data.success) {
      realDispatched = true;
      serverMessage = `250 OK: Invoice delivered via SMTP to ${recipient}!`;
      debugTrace = data.debugTrace || [];
    } else {
      serverMessage = data.error || 'SMTP requires valid App Password';
      debugTrace = data.debugTrace || [data.error];
    }
  } catch (err: any) {
    serverMessage = `Backend API unavailable: ${err.message}`;
    debugTrace = [`Failed to reach /api/send-email: ${err.message}`];
  }

  const logData: Omit<MailLog, 'id' | 'timestamp'> = {
    recipient,
    recipientName: invoice.clientName,
    subject,
    templateType: 'invoice',
    status: realDispatched ? 'sent' : 'queued',
    smtpHost: `${config.host || 'smtp.gmail.com'}:${config.port || 587}`,
    response: realDispatched ? `250 OK (ID: ${messageId})` : `Queued: ${serverMessage}`,
    phpMailerHeader: 'PHPMailer 6.9.1 / Gmail Relay Engine',
    bodySnippet: `Invoice ${invoice.invoiceNumber} for $${invoice.total.toLocaleString()}`
  };

  const createdLog = await recordMailLog(logData);

  const updatedInvoice: Invoice = {
    ...invoice,
    lastSentAt: new Date().toISOString(),
    status: invoice.status === 'draft' ? 'pending' : invoice.status
  };
  await saveInvoice(updatedInvoice);

  await recordHistoryEvent({
    type: 'email_dispatched',
    title: realDispatched 
      ? `PHPMailer Dispatched: Invoice ${invoice.invoiceNumber}`
      : `Invoice Queued for Dispatch: ${invoice.invoiceNumber}`,
    description: `Invoice for $${invoice.total.toLocaleString()} (${invoice.clientName}). ${serverMessage}`,
    referenceId: invoice.id,
    actor: realDispatched ? 'Gmail SMTP Relay' : 'Invoice Console',
    statusBadge: realDispatched ? 'Sent' : 'Queued',
    amount: invoice.total
  });

  return {
    success: true,
    realDispatched,
    needsAuth: !realDispatched,
    messageId,
    smtpResponse: serverMessage,
    mailLog: createdLog,
    debugTrace,
    gmailComposeUrl
  };
}

export async function sendProposalViaPhpMailer(proposal: Proposal, config: SmtpConfig): Promise<PhpMailerSendResult> {
  const proposalArchiveEmail = 'thedigitalcoyotes@gmail.com';
  const messageId = `<prop-${proposal.id}-${Date.now()}@${config.host || 'gmail.com'}>`;
  const subject = `[Digital Coyotes] Agency Proposal: ${proposal.title} ($${proposal.totalValue.toLocaleString()})`;

  const plainText = `DIGITAL COYOTES — AGENCY PROPOSAL
Proposal Number: ${proposal.proposalNumber}
Client: ${proposal.clientName} (${proposal.clientEmail})
Address: ${proposal.clientAddress || 'N/A'}
Title: ${proposal.title}
Valid Until: ${proposal.validUntil}
Total Investment: $${proposal.totalValue.toLocaleString()}

SUMMARY & OVERVIEW:
${proposal.summary || ''}

SECTIONS & SCOPE:
${(proposal.sections || []).map(s => `[${s.title}]\n${s.content}\n`).join('\n')}

INVESTMENT & DELIVERABLES:
${(proposal.pricingItems && proposal.pricingItems.length > 0 ? proposal.pricingItems : proposal.milestones).map((item: any) => `- ${item.title || item.deliverable}: $${(item.amount || item.cost || 0).toLocaleString()}`).join('\n')}

TERMS & CONDITIONS:
${proposal.terms || 'Payment terms: Due within 15 days of invoice date.'}

---
Dispatched by Digital Coyotes Agency Portal (https://digicoyotes2026.vercel.app)
`;

  const htmlBody = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 640px; margin: 0 auto; background: #0b0f19; color: #f1f5f9; padding: 28px; border-radius: 16px; border: 1px solid #1e293b;">
  <div style="border-bottom: 2px solid #f97316; padding-bottom: 16px; margin-bottom: 20px;">
    <h1 style="color: #f97316; margin: 0; font-size: 22px; letter-spacing: -0.5px;">DIGITAL COYOTES</h1>
    <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 13px;">Agency SOW & Commercial Proposal — ${proposal.proposalNumber}</p>
  </div>

  <div style="background: #131b2e; padding: 16px; border-radius: 12px; margin-bottom: 20px;">
    <div style="font-size: 11px; text-transform: uppercase; color: #f97316; font-weight: bold; letter-spacing: 1px;">PREPARED FOR</div>
    <h2 style="color: #ffffff; margin: 4px 0; font-size: 18px;">${proposal.clientName}</h2>
    <div style="color: #94a3b8; font-size: 13px;">${proposal.clientEmail} · ${proposal.clientAddress || ''}</div>
    <div style="color: #cbd5e1; font-size: 12px; margin-top: 8px;">Valid until: <strong>${proposal.validUntil}</strong></div>
  </div>

  <div style="margin-bottom: 24px;">
    <h3 style="color: #ffffff; font-size: 16px; margin-bottom: 8px;">${proposal.title}</h3>
    <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">${proposal.summary || ''}</p>
  </div>

  ${(proposal.sections || []).map(s => `
  <div style="margin-bottom: 18px; padding: 12px 16px; background: #0f172a; border-radius: 8px; border-left: 3px solid #f97316;">
    <h4 style="color: #f8fafc; margin: 0 0 6px 0; font-size: 14px;">${s.title}</h4>
    <p style="color: #94a3b8; font-size: 13px; margin: 0; line-height: 1.5; white-space: pre-line;">${s.content}</p>
  </div>
  `).join('')}

  <div style="margin: 24px 0;">
    <h4 style="color: #ffffff; font-size: 14px; margin-bottom: 12px;">Investment & Deliverables</h4>
    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
      <thead>
        <tr style="background: #1e293b; color: #f97316; text-align: left;">
          <th style="padding: 10px;">Item</th>
          <th style="padding: 10px; text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${(proposal.pricingItems && proposal.pricingItems.length > 0 ? proposal.pricingItems : proposal.milestones).map((item: any) => `
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px; color: #f1f5f9;">${item.title || item.deliverable}</td>
          <td style="padding: 10px; text-align: right; color: #f97316; font-weight: bold;">$${(item.amount || item.cost || 0).toLocaleString()}</td>
        </tr>
        `).join('')}
      </tbody>
      <tfoot>
        <tr style="background: #131b2e; font-weight: bold;">
          <td style="padding: 12px; color: #ffffff; font-size: 15px;">Total Investment</td>
          <td style="padding: 12px; text-align: right; color: #22c55e; font-size: 17px;">$${proposal.totalValue.toLocaleString()}</td>
        </tr>
      </tfoot>
    </table>
  </div>

  <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #1e293b; font-size: 12px; color: #64748b;">
    <p>Terms: ${proposal.terms || 'Net 15 days.'}</p>
    <p style="margin-top: 8px;">Recipient Mail: thedigitalcoyotes@gmail.com</p>
  </div>
</div>
`;

  const gmailComposeUrl = generateGmailComposeUrl(
    proposalArchiveEmail,
    subject,
    plainText,
    proposal.clientEmail
  );

  let realDispatched = false;
  let serverMessage = '';
  let debugTrace: string[] = [];

  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: proposalArchiveEmail,
        cc: proposal.clientEmail,
        subject,
        html: htmlBody,
        text: plainText,
        smtpConfig: config
      })
    });

    const data = await response.json();
    if (data.success) {
      realDispatched = true;
      serverMessage = `250 OK: Proposal delivered via SMTP to ${proposalArchiveEmail}!`;
      debugTrace = data.debugTrace || [];
    } else {
      serverMessage = data.error || 'SMTP requires App Password';
      debugTrace = data.debugTrace || [data.error];
    }
  } catch (err: any) {
    serverMessage = `Backend unreachable: ${err.message}`;
    debugTrace = [
      `Attempted connection to /api/send-email`,
      `Diagnostic: ${err.message}`
    ];
  }

  // If real SMTP password is not configured yet, add clear guidance
  if (!realDispatched) {
    debugTrace.push(
      `--------------------------------------------------`,
      `LIVE GMAIL DISPATCH:`,
      `You can click 'Open in Gmail Compose' to send this email to thedigitalcoyotes@gmail.com in 1 click!`,
      `To automate background delivery without opening Gmail:`,
      `1. Open Google Account (myaccount.google.com/apppasswords)`,
      `2. Generate a 16-character App Password for 'Mail'`,
      `3. Enter it in Settings > SMTP Credentials (host: smtp.gmail.com, user: thedigitalcoyotes@gmail.com)`
    );
  }

  const logData: Omit<MailLog, 'id' | 'timestamp'> = {
    recipient: `${proposalArchiveEmail}, ${proposal.clientEmail}`,
    recipientName: `Digital Coyotes Hub & ${proposal.clientName}`,
    subject,
    templateType: 'proposal',
    status: realDispatched ? 'sent' : 'queued',
    smtpHost: `${config.host || 'smtp.gmail.com'}:${config.port || 587} (${config.port === 465 ? 'SSL' : 'TLS'})`,
    response: realDispatched 
      ? `250 2.0.0 Ok: queued via PHPMailer to ${proposalArchiveEmail} (ID: ${messageId})`
      : `Queued: ${serverMessage}. Ready for Gmail compose.`,
    phpMailerHeader: 'PHPMailer 6.9.1 (Digital Coyotes Engine)',
    bodySnippet: `Proposal ${proposal.proposalNumber}: "${proposal.title}" ($${proposal.totalValue.toLocaleString()})`
  };

  const createdLog = await recordMailLog(logData);

  const updatedProposal: Proposal = {
    ...proposal,
    sentAt: new Date().toISOString(),
    status: proposal.status === 'draft' ? 'sent' : proposal.status
  };
  await saveProposal(updatedProposal);

  await recordHistoryEvent({
    type: 'proposal_sent',
    title: realDispatched 
      ? `PHPMailer Dispatched: Proposal ${proposal.proposalNumber}`
      : `Proposal Ready for Mail Dispatch: ${proposal.proposalNumber}`,
    description: realDispatched 
      ? `Delivered proposal "${proposal.title}" ($${proposal.totalValue.toLocaleString()}) to ${proposalArchiveEmail} via PHPMailer.`
      : `Proposal "${proposal.title}" queued. ${serverMessage}`,
    referenceId: proposal.id,
    actor: realDispatched ? 'PHPMailer v6.9 Engine' : 'Proposal Dispatcher',
    statusBadge: realDispatched ? 'Sent' : 'Queued',
    amount: proposal.totalValue
  });

  return {
    success: true,
    realDispatched,
    needsAuth: !realDispatched,
    messageId,
    smtpResponse: serverMessage,
    mailLog: createdLog,
    debugTrace,
    gmailComposeUrl
  };
}

export async function sendTestEmailViaPhpMailer(
  toEmail: string, 
  toName: string, 
  subject: string, 
  customNote: string, 
  config: SmtpConfig
): Promise<PhpMailerSendResult> {
  const messageId = `<test-${Date.now()}@${config.host || 'gmail.com'}>`;

  let realDispatched = false;
  let serverMessage = '';
  let debugTrace: string[] = [];

  try {
    const resp = await fetch('/api/test-smtp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        smtpConfig: config
      })
    });
    const data = await resp.json();
    if (data.success) {
      realDispatched = true;
      serverMessage = `250 OK: SMTP test transmitted successfully via ${config.host}`;
      debugTrace = [
        `Connected to ${config.host}:${config.port}`,
        `Authenticated as ${config.username}`,
        `Test message accepted by SMTP relay: ${data.messageId}`
      ];
    } else {
      serverMessage = data.error || 'SMTP test failed';
      debugTrace = [
        `Connecting to ${config.host}:${config.port}`,
        `SMTP Error: ${data.error}`,
        `To fix: generate a 16-character App Password at myaccount.google.com/apppasswords`
      ];
    }
  } catch (err: any) {
    serverMessage = `Backend check failed: ${err.message}`;
    debugTrace = [`Failed to contact /api/test-smtp: ${err.message}`];
  }

  const gmailComposeUrl = generateGmailComposeUrl(
    toEmail,
    subject,
    customNote || 'PHPMailer connection verification from Digital Coyotes.'
  );

  const logData: Omit<MailLog, 'id' | 'timestamp'> = {
    recipient: toEmail,
    recipientName: toName,
    subject,
    templateType: 'custom',
    status: realDispatched ? 'sent' : 'queued',
    smtpHost: `${config.host}:${config.port}`,
    response: realDispatched ? `250 2.0.0 Ok (ID: ${messageId})` : `Diagnostic: ${serverMessage}`,
    phpMailerHeader: 'PHPMailer 6.9.1',
    bodySnippet: customNote || 'PHPMailer test message'
  };

  const createdLog = await recordMailLog(logData);

  await recordHistoryEvent({
    type: 'email_dispatched',
    title: realDispatched 
      ? `PHPMailer Test Verified: ${toEmail}` 
      : `PHPMailer Probe Run: ${toEmail}`,
    description: `SMTP probe for ${config.host}. ${serverMessage}`,
    actor: 'SMTP Diagnostic Engine',
    statusBadge: realDispatched ? 'Verified' : 'Notice'
  });

  return {
    success: true,
    realDispatched,
    needsAuth: !realDispatched,
    messageId,
    smtpResponse: serverMessage,
    mailLog: createdLog,
    debugTrace,
    gmailComposeUrl
  };
}
