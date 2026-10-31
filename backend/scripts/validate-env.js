const REQUIRED = [
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'MONGO_URI',
  'ADMIN_SECRET',
  'ADMIN_EMAILS',
  'PORT',
  'NODE_ENV',
];

const EMAILJS_KEYS = [
  'EMAILJS_SERVICE_ID',
  'EMAILJS_TEMPLATE_ID',
  'EMAILJS_PUBLIC_KEY',
  'EMAILJS_PRIVATE_KEY',
];

const PLACEHOLDER = /your[-_ ]|replace|example\.(com|net|org)|<[^>]+>|placeholder|change[\s_-]?me/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const VALID_ENVIRONMENTS = new Set(['development', 'test', 'production']);

function validateEnv(env = process.env) {
  const errors = [];
  const addError = message => errors.push(message);

  for (const key of REQUIRED) {
    const value = String(env[key] ?? '').trim();
    if (!value) addError(`${key} is required.`);
    else if (PLACEHOLDER.test(value)) addError(`${key} still contains a placeholder value.`);
  }

  for (const key of ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'ADMIN_SECRET']) {
    const value = String(env[key] ?? '');
    if (value.length < 32) addError(`${key} must be at least 32 characters.`);
  }
  if (env.JWT_SECRET && env.JWT_SECRET === env.JWT_REFRESH_SECRET) {
    addError('JWT_SECRET and JWT_REFRESH_SECRET must be different values.');
  }

  if (env.MONGO_URI && !/^mongodb(?:\+srv)?:\/\//i.test(env.MONGO_URI.trim())) {
    addError('MONGO_URI must use mongodb:// or mongodb+srv://.');
  }

  if (env.PORT) {
    const port = Number(env.PORT);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      addError('PORT must be an integer between 1 and 65535.');
    }
  }

  if (env.NODE_ENV && !VALID_ENVIRONMENTS.has(env.NODE_ENV.trim().toLowerCase())) {
    addError('NODE_ENV must be development, test, or production.');
  }

  if (env.ADMIN_EMAILS) {
    const adminEmails = env.ADMIN_EMAILS.split(',').map(email => email.trim()).filter(Boolean);
    if (adminEmails.length === 0 || adminEmails.some(email => !EMAIL.test(email))) {
      addError('ADMIN_EMAILS must be a comma-separated list of valid email addresses.');
    }
  }

  const isProduction = String(env.NODE_ENV ?? '').trim().toLowerCase() === 'production';
  const allowedOrigin = String(env.ALLOWED_ORIGIN ?? '').trim();
  if (isProduction && !allowedOrigin) {
    addError('ALLOWED_ORIGIN is required in production.');
  }
  if (allowedOrigin) {
    const origins = allowedOrigin.split(',').map(origin => origin.trim()).filter(Boolean);
    for (const origin of origins) {
      if (origin === '*') {
        if (isProduction) addError('ALLOWED_ORIGIN cannot use a wildcard in production.');
        continue;
      }
      try {
        const parsed = new URL(origin);
        if (!['http:', 'https:'].includes(parsed.protocol) || parsed.origin !== origin.replace(/\/$/, '')) {
          addError('ALLOWED_ORIGIN entries must be origins without paths or credentials.');
        }
        if (isProduction && parsed.protocol !== 'https:') {
          addError('ALLOWED_ORIGIN entries must use HTTPS in production.');
        }
      } catch {
        addError('ALLOWED_ORIGIN contains an invalid URL.');
      }
    }
  }

  const configuredEmailKeys = EMAILJS_KEYS.filter(key => String(env[key] ?? '').trim());
  if (configuredEmailKeys.length > 0 && configuredEmailKeys.length < EMAILJS_KEYS.length) {
    addError('All EMAILJS_* settings must be provided together.');
  }
  for (const key of EMAILJS_KEYS) {
    if (env[key] && PLACEHOLDER.test(env[key])) addError(`${key} still contains a placeholder value.`);
  }
  if (isProduction && configuredEmailKeys.length !== EMAILJS_KEYS.length) {
    addError('All EMAILJS_* settings are required in production for OTP delivery.');
  }

  const googleScriptUrl = String(env.GOOGLE_APPS_SCRIPT_URL ?? '').trim();
  if (googleScriptUrl && PLACEHOLDER.test(googleScriptUrl)) {
    addError('GOOGLE_APPS_SCRIPT_URL still contains a placeholder value.');
  }
  if (isProduction && !googleScriptUrl) {
    addError('GOOGLE_APPS_SCRIPT_URL is required in production for ID verification uploads.');
  }
  const googleScriptSecret = String(env.GOOGLE_APPS_SCRIPT_SECRET ?? '');
  if (googleScriptUrl && !PLACEHOLDER.test(googleScriptUrl) && googleScriptSecret.length < 32) {
    addError('GOOGLE_APPS_SCRIPT_SECRET must be at least 32 characters when the script URL is configured.');
  }
  if (googleScriptSecret && PLACEHOLDER.test(googleScriptSecret)) {
    addError('GOOGLE_APPS_SCRIPT_SECRET still contains a placeholder value.');
  }
  if (googleScriptUrl && !PLACEHOLDER.test(googleScriptUrl)) {
    try {
      if (new URL(googleScriptUrl).protocol !== 'https:') {
        addError('GOOGLE_APPS_SCRIPT_URL must use HTTPS.');
      }
    } catch {
      addError('GOOGLE_APPS_SCRIPT_URL must be a valid HTTPS URL.');
    }
  }

  return [...new Set(errors)];
}

if (require.main === module) {
  require('dotenv').config({ quiet: true });
  const errors = validateEnv(process.env);
  if (errors.length) {
    for (const error of errors) console.error(`❌ ${error}`);
    console.error('\nEnvironment validation failed. Correct the listed settings before starting the server.');
    process.exitCode = 1;
  } else {
    console.log('✅ Environment configuration passed validation.');
  }
}

module.exports = { validateEnv };
