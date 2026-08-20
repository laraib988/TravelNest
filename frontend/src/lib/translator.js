const fs = require('fs');
const path = require('path');

// Dynamically load API Key from env file if running standalone
function loadApiKey() {
  if (process.env.GROQ_API_KEY) return process.env.GROQ_API_KEY;
  const envPath = path.resolve(__dirname, '..', '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/GROQ_API_KEY\s*=\s*(.*)/);
    if (match) return match[1].trim().replace(/['"]/g, '');
  }
  return null;
}

const GROQ_API_KEY = loadApiKey();
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'groq/compound-mini';

/**
 * Translates a flat key-value map of missing translations using Groq Llama 3.3.
 */
async function translateBatch(keysToTranslate, targetLang) {
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY not found in environment variables or .env.local');
  }

  const prompt = `You are a professional travel website localization engine. 
Translate the following English key-value pairs into ${targetLang}. 
Maintain the same JSON keys and translate only the values.
Ensure professional travel industry terminology (tours, bookings, slots, pricing, guides, confirmation).

English JSON:
${JSON.stringify(keysToTranslate, null, 2)}`;

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are a translator that outputs strictly raw JSON. Never write markdown, explanations, or any conversational text. Respond only with the translated JSON object.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Groq API Error (${response.status}): ${errText}`);
  }

  const resJson = await response.json();
  const content = resJson.choices[0].message.content.trim();
  return JSON.parse(content);
}

/**
 * Compares en.json against target locale.json, fetches missing translations, 
 * and writes them back to locale.json.
 */
async function syncLocale(targetLocaleCode, targetLangName) {
  try {
    const localesDir = path.resolve(__dirname, '..', 'locales');
    const enPath = path.join(localesDir, 'en.json');
    const targetPath = path.join(localesDir, `${targetLocaleCode}.json`);

    if (!fs.existsSync(enPath)) {
      console.error(`Base English dictionary not found at: ${enPath}`);
      return;
    }

    const enDict = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    let targetDict = {};

    if (fs.existsSync(targetPath)) {
      targetDict = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
    }

    // Identify missing keys
    const missingKeys = {};
    for (const [key, val] of Object.entries(enDict)) {
      if (!targetDict[key]) {
        missingKeys[key] = val;
      }
    }

    const missingCount = Object.keys(missingKeys).length;
    if (missingCount === 0) {
      console.log(`[i18n] '${targetLocaleCode}' is fully up to date. No API calls needed.`);
      return;
    }

    console.log(`[i18n] Found ${missingCount} missing keys for '${targetLocaleCode}'. Requesting Groq translation...`);
    
    const translatedBatch = await translateBatch(missingKeys, targetLangName);
    
    // Merge translated keys back into the dictionary
    for (const [key, val] of Object.entries(translatedBatch)) {
      targetDict[key] = val;
    }

    // Save updated locale dictionary back to disk
    fs.writeFileSync(targetPath, JSON.stringify(targetDict, null, 2));
    console.log(`[i18n] Successfully updated '${targetLocaleCode}.json' with new translations.`);
  } catch (error) {
    console.error(`[i18n] Translation sync failed for '${targetLocaleCode}':`, error.message);
  }
}

// Automatically sync all standard supported locales
async function syncAllLocales() {
  const supportedLocales = [
    { code: 'ja', name: 'Japanese' },
    { code: 'ur', name: 'Urdu' },
    { code: 'fr', name: 'French' },
    { code: 'ar', name: 'Arabic' }
  ];

  for (const locale of supportedLocales) {
    await syncLocale(locale.code, locale.name);
    console.log('[i18n] Waiting 7 seconds to respect rate limits...');
    await new Promise(resolve => setTimeout(resolve, 7000));
  }
}

// Support executing directly from Node CLI
if (require.main === module) {
  syncAllLocales();
}

module.exports = {
  syncLocale,
  syncAllLocales,
  translateBatch
};
