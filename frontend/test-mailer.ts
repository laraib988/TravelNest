import { customerBookingConfirmationHtml, supplierNewOrderHtml, checkoutOtpHtml } from './src/lib/mailer';
import { writeFileSync } from 'fs';

const creds = {
  email: 'john@example.com',
  temporaryPassword: 'TN-aB3xY9',
  loginUrl: 'http://localhost:3000/login',
};

const bookingData = {
  booking_reference: 'TN-2026-5678',
  qr_voucher_code: 'TN-QR-12345',
  listing_title: 'Mount Fuji Private Tour',
  option_name: 'Alphard',
  slot_start_time: '2026-08-20T19:59:37.216Z',
  total_travelers: 2,
  gross_amount: 425,
  currency: 'USD',
  payment_status: 'PAID',
  status: 'CONFIRMED',
  confirmation_type: 'INSTANT',
  pickup_time: '06:00 AM',
  pickup_location: 'Hotel Lobby',
  lead_name: 'John Doe',
  lead_email: 'john@example.com',
  lead_phone: '+1 555 1234',
  appUrl: 'http://localhost:3000',
  newAccountCredentials: creds,
};

const cust = customerBookingConfirmationHtml(bookingData);
const supp = supplierNewOrderHtml(bookingData);
const otp = checkoutOtpHtml({ email: 'john@example.com', otp_code: '482913', appUrl: 'http://localhost:3000' });

writeFileSync('tmp-email-cust.html', cust);
writeFileSync('tmp-email-otp.html', otp);

console.log('customer has credentials section:', cust.includes('Your Account &amp; Login Details'));
console.log('customer has temp password:', cust.includes('TN-aB3xY9'));
console.log('customer has security tip:', cust.includes('change your password after your first login'));
console.log('customer has login url:', cust.includes('/login'));
console.log('supplier does NOT have credentials:', !supp.includes('Your Account'));
console.log('otp has code:', otp.includes('482913'));
console.log('otp has 10 min:', otp.includes('10 minutes'));