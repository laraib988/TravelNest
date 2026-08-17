# Supplier Side Database Schema

This document outlines the database schema relevant to the **Supplier App** in TravelNest. All data is stored in **Supabase PostgreSQL**.

The mobile app developers should use these exact column names and types when querying data via `@supabase/supabase-js`.

---

## 1. KYC Documents Flow (IMPORTANT)
For KYC (CNIC, Passport, Business License), we do **NOT** store the actual files in PostgreSQL. We use **Supabase Storage**.

### Architecture:
1. **Storage Bucket**: There is a private bucket named `kyc-documents`.
2. **Database Table**: A table named `kyc_documents` tracks the file metadata and approval status.

### The Exact Upload Flow (Mobile App):
**Step 1: Upload the physical file to Supabase Storage**
```typescript
// 1. Convert local mobile file URI to Blob/ArrayBuffer
const file = ...; 

// 2. Upload to the 'kyc-documents' bucket
const filePath = `${currentUserId}/${Date.now()}-cnic.jpg`;
const { data: storageData, error: storageError } = await supabase.storage
  .from('kyc-documents')
  .upload(filePath, file);
```

**Step 2: Save the record in the `kyc_documents` table**
```typescript
// 3. Insert record into database so Admin can review it
const { data, error } = await supabase
  .from('kyc_documents')
  .insert([{
    supplier_id: currentUserId,
    document_type: 'CNIC', // or 'PASSPORT', 'BUSINESS_LICENSE'
    file_path: filePath,   // The path returned from storage upload
    status: 'PENDING'      // Initial status
  }]);
```

### `kyc_documents` Table Schema
| Column Name | Type | Description |
|-------------|------|-------------|
| `id` | `UUID` | Primary Key. |
| `supplier_id` | `TEXT` | ID of the supplier. |
| `document_type` | `TEXT` | `CNIC`, `PASSPORT`, or `BUSINESS_LICENSE`. |
| `file_path` | `TEXT` | The exact path inside the Storage Bucket. |
| `status` | `TEXT` | `PENDING`, `APPROVED`, or `REJECTED`. |
| `admin_remarks`| `TEXT` | Reason if rejected by Admin. |
| `created_at` | `TIMESTAMPTZ`| Timestamp. |

---

## 2. `products` (Listings/Tours)
This table stores all the tours, activities, or properties created by a supplier.

| Column Name | Type | Description |
|-------------|------|-------------|
| `id` | `TEXT` (Primary Key) | Unique ID for the product (e.g., `prod-12345`). |
| `supplier_id` | `TEXT` | ID of the supplier who owns this product (links to auth user). |
| `status` | `TEXT` | `DRAFT`, `PUBLISHED`, or `ARCHIVED`. |
| `current_step` | `INTEGER` | Tracks form progress for drafts (1 to 5). |
| `basic_info` | `JSONB` | Title, category, destination, and summary. |
| `experience_details` | `JSONB` | Detailed description, duration, and highlights. |
| `transport_pricing` | `JSONB` | Array of pricing options (e.g., Standard, VIP) and transport details. |
| `logistics` | `JSONB` | Meeting point, drop-off location, inclusions/exclusions. |
| `itinerary` | `JSONB` | Array of steps/timeline for the tour. |
| `created_at` | `TIMESTAMPTZ` | Timestamp when created. |
| `updated_at` | `TIMESTAMPTZ` | Timestamp when last updated. |

---

## 3. `bookings` (Customer Orders)
This table stores all bookings made by customers. Suppliers query this to see their orders.

| Column Name | Type | Description |
|-------------|------|-------------|
| `id` | `TEXT` (Primary Key) | Unique ID for the booking. |
| `booking_reference` | `TEXT` | Human-readable reference (e.g., `TN-AB123`). |
| `customer_id` | `TEXT` | ID of the customer who booked. |
| `supplier_id` | `TEXT` | ID of the supplier receiving the booking. |
| `listing_id` | `TEXT` | ID of the product/listing booked. |
| `option_id` | `TEXT` | ID of the specific pricing option chosen. |
| `option_name` | `TEXT` | Name of the option (e.g., "VIP Package"). |
| `slot_id` | `TEXT` | ID of the time slot chosen. |
| `slot_start_time` | `TIMESTAMPTZ`| The date and time the activity starts. |
| `total_travelers` | `INTEGER` | Number of people booked. |
| `gross_amount` | `NUMERIC` | Total amount paid by customer. |
| `platform_fee` | `NUMERIC` | TravelNest's commission fee. |
| `supplier_payout` | `NUMERIC` | Amount to be paid to the supplier (`gross - platform_fee`). |
| `currency` | `TEXT` | Default `USD`. |
| `status` | `TEXT` | `PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`. |
| `confirmation_type` | `TEXT` | `INSTANT` or `MANUAL`. |
| `qr_voucher_code` | `TEXT` | Unique code for ticket validation. |
| `traveler_details` | `JSONB` | Primary traveler name, email, phone. |
| `payment_intent_id` | `TEXT` | Stripe payment intent ID for tracking. |

---

## Example Query for App Developer (React Native / Expo)

**Get all bookings for the logged-in supplier:**
```typescript
const { data: myBookings, error } = await supabase
  .from('bookings')
  .select('*')
  .eq('supplier_id', currentUserId)
  .order('created_at', { ascending: false });
```
