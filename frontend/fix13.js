const fs = require('fs');
let c = fs.readFileSync('frontend/src/context/AuthContext.tsx', 'utf8');

c = c.replace(/throw new Error\(resData\.error \+ \(resData\.details \? ": " \+ JSON\.stringify\(resData\.details\) : ""\)\);/g, 
`let errMsg = resData.error;
      if (resData.details) {
        const messages = [];
        for (const key in resData.details) {
          if (key !== '_errors' && resData.details[key]._errors && resData.details[key]._errors.length > 0) {
            messages.push(resData.details[key]._errors[0]);
          }
        }
        if (messages.length > 0) errMsg = messages.join(', ');
      }
      throw new Error(errMsg);`);

fs.writeFileSync('frontend/src/context/AuthContext.tsx', c);
