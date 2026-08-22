const fs = require('fs');
const path = 'frontend/src/context/CurrencyContext.tsx';
let code = fs.readFileSync(path, 'utf8');

const fetchOld = `fetch(\`https://api.frankfurter.app/latest?from=USD&to=\${codes}\`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.rates) {
          setLiveRates({ ...data.rates, USD: 1 });
        }
      });`;

const fetchNew = `fetch(\`https://api.frankfurter.app/latest?from=USD&to=\${codes}\`, { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('API Error');
        return res.json();
      })
      .then((data) => {
        if (data && data.rates) {
          setLiveRates({ ...data.rates, USD: 1 });
        }
      })
      .catch((err) => {
        console.warn('Currency API unavailable, using fallback rates.');
        // Set basic fallback rates if API fails (CORS or network issues)
        setLiveRates({ USD: 1, EUR: 0.9, GBP: 0.78, PKR: 278.5, JPY: 150, INR: 83, SGD: 1.34, AED: 3.67 });
      });`;

code = code.replace(fetchOld, fetchNew);
fs.writeFileSync(path, code);
console.log('Fixed CurrencyContext fetch!');
