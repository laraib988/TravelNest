const fs = require('fs');
let c = fs.readFileSync('frontend/src/context/AuthContext.tsx', 'utf8');

c = c.replace(/throw new Error\(resData\.error \|\| 'Failed to create user via API'\);/g, 'throw new Error(resData.error + (resData.details ? ": " + JSON.stringify(resData.details) : ""));');

fs.writeFileSync('frontend/src/context/AuthContext.tsx', c);
