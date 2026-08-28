const fs = require('fs');

let content = fs.readFileSync('src/app/admin-portal/blogs/new/edit/page.tsx', 'utf8');

// 1. Add focus_keywords_raw
content = content.replace("focus_keywords: [] as string[],", "focus_keywords: [] as string[],\n    focus_keywords_raw: '',");

// 2. Modify handleCreate
content = content.replace(
  "body: JSON.stringify({ ...form, status }),",
  "body: JSON.stringify({ ...form, status, focus_keywords: (form.focus_keywords_raw || '').split(',').map((s: string) => s.trim()).filter(Boolean) }),"
);

// 3. Modify the input field
content = content.replace(
  "value={(form.focus_keywords || []).join(', ')}",
  "value={form.focus_keywords_raw || ''}"
);
content = content.replace(
  "onChange={(e) => setForm({ ...form, focus_keywords: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })}",
  "onChange={(e) => setForm({ ...form, focus_keywords_raw: e.target.value })}"
);

fs.writeFileSync('src/app/admin-portal/blogs/new/edit/page.tsx', content);

// Do the same for [id]/edit/page.tsx
let content2 = fs.readFileSync('src/app/admin-portal/blogs/[id]/edit/page.tsx', 'utf8');

content2 = content2.replace("focus_keywords: [] as string[],", "focus_keywords: [] as string[],\n    focus_keywords_raw: '',");

// For edit, we also need to populate focus_keywords_raw on fetch.
// Let's find setForm(data) and change it to setForm({...data, focus_keywords_raw: (data.focus_keywords || []).join(', ')})
content2 = content2.replace(
  "setForm(data);",
  "setForm({ ...data, focus_keywords_raw: (data.focus_keywords || []).join(', ') });"
);

content2 = content2.replace(
  "body: JSON.stringify({ ...form, status }),",
  "body: JSON.stringify({ ...form, status, focus_keywords: (form.focus_keywords_raw || '').split(',').map((s: string) => s.trim()).filter(Boolean) }),"
);

content2 = content2.replace(
  "value={(form.focus_keywords || []).join(', ')}",
  "value={form.focus_keywords_raw || ''}"
);
content2 = content2.replace(
  "onChange={(e) => setForm({ ...form, focus_keywords: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })}",
  "onChange={(e) => setForm({ ...form, focus_keywords_raw: e.target.value })}"
);

fs.writeFileSync('src/app/admin-portal/blogs/[id]/edit/page.tsx', content2);
