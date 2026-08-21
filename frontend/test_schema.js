const { z } = require('zod');

const signupSchema = z.object({
  email: z.string().email("Invalid email format").max(255, "Email is too long"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100, "Password is too long"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100).regex(/^[a-zA-Z\s\-\']+$/, "Name contains invalid characters. No HTML or scripts allowed."),
  role: z.enum(['CUSTOMER', 'SUPPLIER', 'ADMIN']).default('CUSTOMER'),
  kycData: z.record(z.string(), z.any()).optional(),
});

const payload = {
  email: 'sunnypirkash@gmail.com',
  password: 'password123',
  name: 'rwertytr tt',
  role: 'SUPPLIER',
  kycData: {
    partnerType: 'SOLO',
    companyName: 'rwertytr tt',
    location: 'fdfgr',
    phone: '5634565',
    currency: 'USD ($) - US Dollar',
    business_reg: '645657545465',
    tax_id: 'N/A',
    documents: [
      { doc_id: 'doc-123-1', doc_type: 'CNIC/Passport', file_name: 'Japan_Itinerary.pdf', status: 'PENDING' }
    ]
  }
};

const result = signupSchema.safeParse(payload);
console.log(JSON.stringify(result, null, 2));
