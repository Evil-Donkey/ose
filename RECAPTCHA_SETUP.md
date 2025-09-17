# Google reCAPTCHA Setup Guide

## Overview
This project now includes Google reCAPTCHA v3 integration for the investor portal signup form. reCAPTCHA v3 runs invisibly in the background and provides a risk score without requiring user interaction.

## Setup Instructions

### 1. Get reCAPTCHA Keys
1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Create a new site or use an existing one
3. Select "reCAPTCHA v3" as the reCAPTCHA type
4. Add your domain(s) to the domain list
5. Copy the **Site Key** and **Secret Key**

### 2. Environment Variables
Create a `.env.local` file in the project root and add the following variables:

```env
# Google reCAPTCHA Configuration
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

**Important:** 
- Replace `your_site_key_here` with your actual Site Key
- Replace `your_secret_key_here` with your actual Secret Key
- The `NEXT_PUBLIC_` prefix is required for client-side access
- Never commit the `.env.local` file to version control

### 3. Configuration Details

#### reCAPTCHA Score Threshold
The current implementation uses a score threshold of 0.5 (out of 1.0). This means:
- Scores ≥ 0.5: Likely human, form submission allowed
- Scores < 0.5: Likely bot, form submission blocked

You can adjust this threshold in `/src/app/api/auth/signup/route.js` by changing the score comparison:
```javascript
if (!recaptchaData.success || recaptchaData.score < 0.5) {
```

#### Action Name
The reCAPTCHA action is set to "signup" for this form. This helps Google track different types of interactions on your site.

## How It Works

1. **Client Side**: The reCAPTCHA script loads automatically when the signup page is visited
2. **Form Submission**: When the user submits the form, reCAPTCHA generates a token invisibly
3. **Server Verification**: The token is sent to your API, which verifies it with Google's servers
4. **Score Check**: Google returns a score (0.0 to 1.0) indicating the likelihood the user is human
5. **Decision**: Based on the score, the form submission is either allowed or blocked

## Testing

### Development Testing
- Use the test keys provided by Google for development
- Test keys always return a score of 0.9 (high confidence human)

### Production Testing
- Monitor the reCAPTCHA scores in your logs
- Adjust the threshold if needed based on legitimate user feedback
- Check Google's reCAPTCHA admin console for analytics

## Troubleshooting

### Common Issues
1. **"reCAPTCHA not ready"**: The script hasn't loaded yet. This is handled gracefully in the current implementation.
2. **Low scores for legitimate users**: Consider lowering the threshold or checking for other factors affecting the score.
3. **Environment variables not working**: Ensure the `.env.local` file is in the project root and restart your development server.

### Debug Mode
To see reCAPTCHA scores in the console, you can add logging in the API route:
```javascript
console.log('reCAPTCHA score:', recaptchaData.score);
```

## Security Notes

- The secret key should never be exposed to the client
- Always verify reCAPTCHA tokens on the server side
- Consider implementing additional rate limiting for extra security
- Monitor for unusual patterns in reCAPTCHA scores

## Files Modified

- `/src/components/ReCAPTCHA/index.js` - New reCAPTCHA component
- `/src/components/SignupForm/index.js` - Updated to use reCAPTCHA
- `/src/app/api/auth/signup/route.js` - Added server-side verification
- `/src/app/layout.js` - Added reCAPTCHA script loading
