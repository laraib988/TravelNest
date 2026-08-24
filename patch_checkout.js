const fs = require('fs');
let code = fs.readFileSync('frontend/src/app/checkout/page.tsx', 'utf8');

code = code.replace(
    /<input[\s\S]*?placeholder="e\.g\., Hotel Name or Address"[\s\S]*?value=\{formData\.pickup_location\}[\s\S]*?\/>/,
    `<MapboxAutocomplete
                  required
                  placeholder="e.g., Hotel Name or Address"
                  value={formData.pickup_location}
                  onChange={(val) => setFormData({ ...formData, pickup_location: val, dropoff_location: formData.same_as_pickup ? val : formData.dropoff_location })}
                  proximityStr={listing.pickup_location || listing.city}
                />`
);

code = code.replace(
    /<input[\s\S]*?placeholder="e\.g\., Hotel Name or Address"[\s\S]*?value=\{formData\.dropoff_location\}[\s\S]*?\/>/,
    `<MapboxAutocomplete
                required={!formData.same_as_pickup}
                placeholder="e.g., Hotel Name or Address"
                disabled={formData.same_as_pickup}
                value={formData.dropoff_location}
                onChange={(val) => setFormData({ ...formData, dropoff_location: val })}
                proximityStr={listing.pickup_location || listing.city}
              />`
);

fs.writeFileSync('frontend/src/app/checkout/page.tsx', code);
console.log('Regex patch successful');
