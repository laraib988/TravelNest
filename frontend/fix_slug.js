
const fs = require("fs");
let code = fs.readFileSync("src/app/category/[slug]/page.tsx", "utf8");
code = code.replace(
  "slug: rawTour.id, // Using ID as slug based on current architecture",
  "slug: rawTour.slug || `${(rawTour.basic_info?.title || rawTour.title || \"Tour\").toLowerCase().replace(/[^a-z0-9]+/g, \"-\").replace(/(^-|-$)/g, \"\")}-${rawTour.id}`,"
);
fs.writeFileSync("src/app/category/[slug]/page.tsx", code);

