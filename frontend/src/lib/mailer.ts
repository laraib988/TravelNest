import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY || '';
const from = process.env.EMAIL_FROM || 'TravelNest <onboarding@resend.dev>';
const appUrl = process.env.APP_URL || 'http://localhost:3000';

// Singleton Resend client (only create it if an API key is configured)
let resend: Resend | null = null;
if (apiKey) {
  resend = new Resend(apiKey);
}

function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c] as string));
}

function formatMoney(amount: number, currency: string): string {
  const num = Number(amount) || 0;
  const symbolMap: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', JPY: '¥', PKR: '₨', INR: '₹' };
  const sym = symbolMap[currency] || `${currency} `;
  return `${sym}${num.toFixed(2)}`;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return iso;
  }
}

function layout(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TravelNest</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(2,132,199,0.08);">
          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg,#0284c7 0%,#0ea5e9 60%,#06b6d4 100%);padding:28px 32px;text-align:center;">
              <div style="font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">Travel<strong style="color:#fbbf24;">Nest</strong></div>
              <div style="font-size:13px;color:rgba(255,255,255,0.85);margin-top:4px;">Book • Explore • Travel</div>
            </td>
          </tr>
          ${body}
          <!-- FOOTER -->
          <tr>
            <td style="background:#0f172a;padding:22px 32px;text-align:center;">
              <div style="color:#94a3b8;font-size:12px;line-height:1.7;">
                <strong style="color:#e2e8f0;">TravelNest</strong> · Crafted experiences around the world<br/>
                This is an automated email. Please do not reply directly.<br/>
                <a href="${appUrl}" style="color:#38bdf8;text-decoration:none;">Visit TravelNest</a>
              </div>
            </td>
          </tr>
        </table>
        <div style="color:#94a3b8;font-size:11px;margin-top:14px;text-align:center;">© ${new Date().getFullYear()} TravelNest. All rights reserved.</div>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function detailRow(label: string, value: string, muted = false): string {
  return `
    <tr>
      <td style="padding:8px 0;color:#64748b;font-size:13px;width:40%;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:8px 0;color:${muted ? '#94a3b8' : '#0f172a'};font-size:13px;font-weight:600;vertical-align:top;">${escapeHtml(value)}</td>
    </tr>`;
}

function moneyRow(label: string, value: string, color = '#0f172a'): string {
  return `
    <tr>
      <td style="padding:8px 0;color:#64748b;font-size:13px;">${escapeHtml(label)}</td>
      <td style="padding:8px 0;color:${color};font-size:13px;font-weight:700;text-align:right;">${value}</td>
    </tr>`;
}

export interface BookingEmailData {
  booking_reference: string;
  qr_voucher_code?: string;
  listing_title?: string;
  option_name?: string;
  slot_start_time?: string;
  total_travelers?: number;
  gross_amount?: number;
  currency?: string;
  payment_status?: string;
  status?: string;
  confirmation_type?: string;
  pickup_time?: string;
  pickup_location?: string;
  dropoff_location?: string;
  lead_name?: string;
  lead_email?: string;
  lead_phone?: string;
  special_requirements?: string;
  supplier_email?: string;
  appUrl?: string;
  // New-account credentials (only populated when an account was auto-created)
  newAccountCredentials?: {
    email: string;
    temporaryPassword: string;
    loginUrl?: string;
  };
}

// ---------- CUSTOMER BOOKING CONFIRMATION ----------
export function customerBookingConfirmationHtml(data: BookingEmailData): string {
  const currency = data.currency || 'USD';
  const total = formatMoney(Number(data.gross_amount) || 0, currency);
  const travelerName = escapeHtml(data.lead_name || 'Traveler');
  const listing = escapeHtml(data.listing_title || 'Your Tour');

  const body = `
  <!-- HERO BADGE -->
  <tr>
    <td style="padding:36px 32px 8px;text-align:center;">
      <div style="width:64px;height:64px;border-radius:50%;background:#ecfdf5;margin:0 auto;line-height:64px;">&#9989;</div>
      <h1 style="margin:16px 0 6px;font-size:24px;color:#0f172a;font-weight:800;">Booking Confirmed!</h1>
      <p style="margin:0;color:#64748b;font-size:14px;">Hi ${travelerName}, your trip is all set. We can&rsquo;t wait to have you on board.</p>
    </td>
  </tr>
  <!-- REFERENCE STRIP -->
  <tr>
    <td style="padding:16px 32px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:12px;">
        <tr>
          <td style="padding:16px;text-align:center;">
            <div style="font-size:11px;color:#0284c7;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;">Booking Reference</div>
            <div style="font-size:22px;font-weight:800;color:#0c4a6e;letter-spacing:1px;">${escapeHtml(data.booking_reference)}</div>
          </td>
          ${data.qr_voucher_code ? `
          <td style="padding:16px;text-align:center;border-left:1px dashed #7dd3fc;">
            <div style="font-size:11px;color:#0284c7;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;">Voucher Code</div>
            <div style="font-size:18px;font-weight:800;color:#0c4a6e;">${escapeHtml(data.qr_voucher_code)}</div>
          </td>` : ''}
        </tr>
      </table>
    </td>
  </tr>
  <!-- DETAILS -->
  <tr>
    <td style="padding:20px 32px 4px;">
      <h2 style="margin:0 0 10px;font-size:16px;color:#0f172a;font-weight:800;">&#128205; Tour Details</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${detailRow('Experience', listing)}
        ${detailRow('Option', data.option_name || 'Standard Option')}
        ${detailRow('Date & Time', formatDate(data.slot_start_time || ''))}
        ${detailRow('Pickup Time', data.pickup_time || '—')}
        ${detailRow('Pickup Location', data.pickup_location || '—')}
        ${data.dropoff_location ? detailRow('Drop-off', data.dropoff_location) : ''}
        ${detailRow('Travelers', String(data.total_travelers || 1))}
        ${detailRow('Confirmation', data.confirmation_type === 'MANUAL' ? 'Pending Supplier Approval' : 'Instant Confirmation')}
      </table>
    </td>
  </tr>
  <!-- PAYMENT -->
  <tr>
    <td style="padding:16px 32px 4px;">
      <h2 style="margin:0 0 10px;font-size:16px;color:#0f172a;font-weight:800;">&#128176; Payment</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${moneyRow('Total Amount', total, '#0284c7')}
        ${moneyRow('Status', data.payment_status === 'PAID' ? 'Paid' : 'Reserved (Pay Later)', data.payment_status === 'PAID' ? '#059669' : '#d97706')}
      </table>
    </td>
  </tr>
  <!-- TRAVELER -->
  <tr>
    <td style="padding:16px 32px 4px;">
      <h2 style="margin:0 0 10px;font-size:16px;color:#0f172a;font-weight:800;">&#128100; Lead Traveler</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${detailRow('Name', data.lead_name || '—')}
        ${detailRow('Email', data.lead_email || '—')}
        ${detailRow('Phone', data.lead_phone || '—')}
        ${data.special_requirements ? detailRow('Special Requirements', data.special_requirements) : ''}
      </table>
    </td>
  </tr>
  ${data.newAccountCredentials ? `
  <!-- NEW ACCOUNT CREDENTIALS -->
  <tr>
    <td style="padding:16px 32px 4px;">
      <h2 style="margin:0 0 10px;font-size:16px;color:#0f172a;font-weight:800;">&#128273; Your Account &amp; Login Details</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;">
        <tr>
          <td style="padding:20px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${detailRow('Portal Login URL', (data.newAccountCredentials.loginUrl || appUrl + '/login'))}
              ${detailRow('Email Address', data.newAccountCredentials.email)}
              ${detailRow('Temporary Password', data.newAccountCredentials.temporaryPassword)}
            </table>
            <div style="margin-top:12px;padding:12px 14px;background:#fef3c7;border-radius:8px;color:#92400e;font-size:12px;line-height:1.6;">
              &#128274; <strong>Security tip:</strong> Please change your password after your first login.
            </div>
            <div style="margin-top:16px;text-align:center;">
              <a href="${appUrl}/login" style="display:inline-block;background:#d97706;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;padding:11px 26px;border-radius:10px;">Log in to TravelNest</a>
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>` : ''}
  <!-- CTA -->
  <tr>
    <td style="padding:24px 32px 8px;text-align:center;">
      <a href="${appUrl}/bookings" style="display:inline-block;background:#0284c7;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:13px 32px;border-radius:10px;">View My Bookings</a>
      <p style="color:#94a3b8;font-size:12px;margin-top:12px;">Need help? Our support team is here 24/7.</p>
    </td>
  </tr>`;
  return layout(body);
}

// ---------- SUPPLIER NEW ORDER ----------
export function supplierNewOrderHtml(data: BookingEmailData): string {
  const currency = data.currency || 'USD';
  const gross = formatMoney(Number(data.gross_amount) || 0, currency);
  const listing = escapeHtml(data.listing_title || 'a new tour');

  const body = `
  <tr>
    <td style="padding:36px 32px 8px;text-align:center;">
      <div style="width:64px;height:64px;border-radius:50%;background:#fffbeb;margin:0 auto;line-height:64px;">&#128276;</div>
      <h1 style="margin:16px 0 6px;font-size:24px;color:#0f172a;font-weight:800;">You&rsquo;ve Got a New Order!</h1>
      <p style="margin:0;color:#64748b;font-size:14px;">A customer just booked <strong>${listing}</strong>. Review and manage it right away.</p>
    </td>
  </tr>
  <!-- REFERENCE STRIP -->
  <tr>
    <td style="padding:16px 32px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;">
        <tr>
          <td style="padding:16px;text-align:center;">
            <div style="font-size:11px;color:#b45309;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;">Booking Reference</div>
            <div style="font-size:20px;font-weight:800;color:#78350f;letter-spacing:1px;">${escapeHtml(data.booking_reference)}</div>
          </td>
          <td style="padding:16px;text-align:center;border-left:1px dashed #fcd34d;">
            <div style="font-size:11px;color:#b45309;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;">Order Value</div>
            <div style="font-size:20px;font-weight:800;color:#78350f;">${gross}</div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <!-- DETAILS -->
  <tr>
    <td style="padding:20px 32px 4px;">
      <h2 style="margin:0 0 10px;font-size:16px;color:#0f172a;font-weight:800;">&#128205; Booking Details</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${detailRow('Experience', listing)}
        ${detailRow('Option', data.option_name || 'Standard Option')}
        ${detailRow('Date & Time', formatDate(data.slot_start_time || ''))}
        ${detailRow('Pickup Time', data.pickup_time || '—')}
        ${detailRow('Pickup Location', data.pickup_location || '—')}
        ${data.dropoff_location ? detailRow('Drop-off', data.dropoff_location) : ''}
        ${detailRow('Travelers', String(data.total_travelers || 1))}
        ${detailRow('Status', data.status === 'PENDING_SUPPLIER_APPROVAL' ? 'Pending Your Approval' : 'Confirmed', data.status !== 'PENDING_SUPPLIER_APPROVAL')}
      </table>
    </td>
  </tr>
  <!-- CUSTOMER -->
  <tr>
    <td style="padding:16px 32px 4px;">
      <h2 style="margin:0 0 10px;font-size:16px;color:#0f172a;font-weight:800;">&#128100; Customer</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${detailRow('Name', data.lead_name || '—')}
        ${detailRow('Email', data.lead_email || '—')}
        ${detailRow('Phone', data.lead_phone || '—')}
        ${data.special_requirements ? detailRow('Special Requirements', data.special_requirements) : ''}
      </table>
    </td>
  </tr>
  <!-- PAYMENT -->
  <tr>
    <td style="padding:16px 32px 4px;">
      <h2 style="margin:0 0 10px;font-size:16px;color:#0f172a;font-weight:800;">&#128176; Payment</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${moneyRow('Total Amount', gross, '#b45309')}
        ${moneyRow('Status', data.payment_status === 'PAID' ? 'Paid' : 'Reserved (Pay Later)', data.payment_status === 'PAID' ? '#059669' : '#d97706')}
      </table>
    </td>
  </tr>
  <!-- CTA -->
  <tr>
    <td style="padding:24px 32px 8px;text-align:center;">
      <a href="${appUrl}/supplier/bookings" style="display:inline-block;background:#d97706;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:13px 32px;border-radius:10px;">Manage Booking</a>
      <p style="color:#94a3b8;font-size:12px;margin-top:12px;">New orders appear in your supplier dashboard instantly.</p>
    </td>
  </tr>`;
  return layout(body);
}

// ---------- CHECKOUT OTP (EMAIL VERIFICATION) ----------
export function checkoutOtpHtml(data: { email: string; otp_code: string; appUrl?: string }): string {
  const otp = escapeHtml(data.otp_code);
  const email = escapeHtml(data.email);

  const body = `
  <tr>
    <td style="padding:36px 32px 8px;text-align:center;">
      <div style="width:64px;height:64px;border-radius:50%;background:#eff6ff;margin:0 auto;line-height:64px;">&#128273;</div>
      <h1 style="margin:16px 0 6px;font-size:24px;color:#0f172a;font-weight:800;">Verify Your Email</h1>
      <p style="margin:0;color:#64748b;font-size:14px;">Use the code below to complete your checkout securely.</p>
    </td>
  </tr>
  <!-- OTP STRIP -->
  <tr>
    <td style="padding:20px 32px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;">
        <tr>
          <td style="padding:24px;text-align:center;">
            <div style="font-size:11px;color:#2563eb;text-transform:uppercase;letter-spacing:1px;font-weight:700;margin-bottom:12px;">Your 6-Digit Verification Code</div>
            <div style="font-size:42px;font-weight:800;color:#1d4ed8;letter-spacing:10px;">${otp}</div>
            <div style="font-size:12px;color:#64748b;margin-top:14px;">This code expires in <strong>10 minutes</strong>.</div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding:8px 32px 24px;text-align:center;">
      <p style="color:#94a3b8;font-size:13px;line-height:1.7;margin:0;">
        Enter this code on the checkout page to confirm your email address.<br/>
        If you did not request this, you can safely ignore this email.
      </p>
      <p style="color:#475569;font-size:13px;margin-top:16px;">Code sent to: <strong>${email}</strong></p>
    </td>
  </tr>`;
  return layout(body);
}

// ---------- SEND HELPERS ----------
export async function sendOtpEmail(email: string, otp_code: string): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    return { success: false, error: 'Resend API key not configured (RESEND_API_KEY)' };
  }
  if (!email) {
    return { success: false, error: 'Email is required' };
  }
  try {
    await resend.emails.send({
      from,
      to: email,
      subject: 'Your TravelNest Verification Code',
      html: checkoutOtpHtml({ email, otp_code, appUrl }),
    });
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Failed to send OTP email' };
  }
}
export async function sendBookingEmails(data: BookingEmailData): Promise<{ customer?: boolean; supplier?: boolean; errors: string[] }> {
  const errors: string[] = [];

  if (!resend) {
    errors.push('Resend API key not configured (RESEND_API_KEY)');
    return { errors };
  }

  const customerEmail = data.lead_email;
  if (customerEmail) {
    try {
      await resend.emails.send({
        from,
        to: customerEmail,
        subject: `Booking Confirmed · ${data.booking_reference} · TravelNest`,
        html: customerBookingConfirmationHtml(data),
      });
    } catch (e: any) {
      errors.push(`Customer email failed: ${e?.message || 'unknown'}`);
    }
  } else {
    errors.push('Customer email not provided');
  }

  const supplierEmail = data.supplier_email;
  if (supplierEmail) {
    try {
      await resend.emails.send({
        from,
        to: supplierEmail,
        subject: `New Order Received · ${data.booking_reference} · TravelNest`,
        html: supplierNewOrderHtml(data),
      });
    } catch (e: any) {
      errors.push(`Supplier email failed: ${e?.message || 'unknown'}`);
    }
  } else {
    errors.push('Supplier email not resolved');
  }

  return { errors };
}