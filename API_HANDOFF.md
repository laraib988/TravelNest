# TravelNest Mobile App Integration Guide (Real-Time Supabase)

**Audience:** React Native (Expo) Customer + Supplier app developers
**Backend Engine:** Supabase (PostgreSQL + Auth + Storage)
**Rule:** There is no separate backend API or local mock database anymore. Both the Website (Next.js) and the Mobile Apps (Expo) read/write directly to the same **Supabase** database in real-time.

---

## 1. Architecture Overview (Updated)

```
┌─────────────────┐       ┌──────────────────┐
│  Next.js Web    │       │  Mobile Apps     │
│  (Admin/Web)    │       │  (Customer/Supp) │
└────────┬────────┘       └────────┬─────────┘
         │                         │
         │   @supabase/supabase-js │
         └─────────────┬───────────┘
                       ▼
          Supabase (PostgreSQL + Auth)
               (Single Source of Truth)
```

- **No more REST API wrapping:** You do not need to call `http://localhost:4000` or Render APIs.
- **Direct DB Access:** Use the official `@supabase/supabase-js` SDK inside your Expo app to fetch and subscribe to data in real-time.

---

## 2. Environment Variables & Setup

Install the Supabase client in your Expo project:

```bash
npm install @supabase/supabase-js @react-native-async-storage/async-storage
```

Create a `.env` file in your Expo project (ask the admin for actual keys):

```env
EXPO_PUBLIC_SUPABASE_URL=https://vozgnbqjqiaabkrpniqb.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_UCCVVvQh_zjg6NNJeCQPPg_...
```

### 2.1 Initializing the Client (Expo)

```ts
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

---

## 3. Authentication (Ready & Active)

Authentication is now fully handled by **Supabase Auth**. Both Customer and Supplier apps use this.

### 3.1 Register / Sign Up
```ts
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'securepassword123',
  options: {
    data: {
      role: 'supplier', // or 'customer'
      full_name: 'John Doe'
    }
  }
});
```
*Note: The user data is automatically inserted into the public `users` table via a Supabase trigger.*

### 3.2 Login / Sign In
```ts
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'securepassword123',
});

// Access Token is handled automatically by Supabase SDK
// To get the logged-in user details & role:
const user = data.user;
const role = user?.user_metadata?.role; // 'customer' or 'supplier'
```

### 3.3 Log Out
```ts
await supabase.auth.signOut();
```

---

## 4. Data Fetching Examples (Real-Time DB)

Instead of traditional `GET /api/listings`, you query the database tables directly using the SDK.

### 4.1 Fetching Listings (Marketplace)
```ts
// Get all published listings
const { data: listings, error } = await supabase
  .from('listings')
  .select('*')
  .eq('is_published', true);

// Get single listing with supplier details
const { data: listing, error } = await supabase
  .from('listings')
  .select('*, users(name, email)')
  .eq('slug', 'lahore-city-tour')
  .single();
```

### 4.2 Fetching Destinations
```ts
const { data: destinations, error } = await supabase
  .from('destinations')
  .select('*')
  .eq('is_published', true);
```

### 4.3 Creating a Booking (Customer App)
```ts
const { data, error } = await supabase
  .from('bookings')
  .insert([
    {
      user_id: supabase.auth.getUser().id,
      listing_id: 'listing-uuid-here',
      supplier_id: 'supplier-uuid-here',
      booking_date: '2026-08-20',
      total_price: 150.00,
      status: 'PENDING'
    }
  ]);
```

### 4.4 Listening to Real-time Updates (Supplier App)
Suppliers can get instant notifications when a new booking arrives.
```ts
const subscription = supabase
  .channel('public:bookings')
  .on('postgres_changes', { 
    event: 'INSERT', 
    schema: 'public', 
    table: 'bookings',
    filter: `supplier_id=eq.${currentUserId}` 
  }, payload => {
    console.log('New booking received!', payload.new);
  })
  .subscribe();
```

---

## 5. Database Schema Reference

All tables are in the `public` schema.

| Table Name | Purpose | Key Columns |
|------------|---------|-------------|
| `users` | User profiles | `id` (auth.uid), `email`, `role`, `kyc_status` |
| `destinations` | City/Country pages | `id`, `name`, `slug`, `hero_image`, `is_published` |
| `listings` | Supplier tours/hotels | `id`, `supplier_id`, `title`, `price`, `images` |
| `bookings` | Customer orders | `id`, `user_id`, `listing_id`, `status`, `payment_status` |

---

## Summary for App Team
1. Discard the old NestJS REST API codebase and `localhost:4000`.
2. Integrate `@supabase/supabase-js` into Expo.
3. Use Supabase Auth for Login/Signup (`signUp`, `signInWithPassword`).
4. Use Supabase DB queries for listing, booking, and managing data (`supabase.from(...)`).
5. Real-time sockets are built-in for instant updates (e.g. Booking Status changes).
