const fs = require('fs');
const path = 'frontend/src/app/admin/reviews/page.tsx';
let code = fs.readFileSync(path, 'utf8');

const oldAvatarStr = "src={review.user_avatar}";
const newAvatarStr = "src={review.user_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user_name || 'Anonymous')}&background=0ea5e9&color=fff`}";

code = code.replace(oldAvatarStr, newAvatarStr);

fs.writeFileSync(path, code);
console.log('Fixed admin DP!');
