# Email Verification Testing Guide

## Prerequisites
1. Backend server running: `npm run start:dev`
2. MongoDB running
3. Resend API key configured in `.env`

## Test Flow

### Step 1: Register a New User
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "username": "testuser123",
    "password": "Test123!@#",
    "role": "viewer"
  }'
```

**Expected Response:**
```json
{
  "message": "Registration successful. Please check your email to verify your account."
}
```

### Step 2: Check Your Email
- Open your email inbox
- Look for email from "onboarding@resend.dev"
- Subject: "Verify Your Email - LA JOIE DE HICHA"
- Click the "Verify Email Address" button

### Step 3: Verify Email (Automatic)
When you click the link, you'll be redirected to:
```
http://localhost:3001/auth/verify-email/TOKEN
```

**Expected Result:**
- Green success page with ✅ icon
- "Email Verified Successfully!" message
- "Go to Login" button

### Step 4: Try Login Before Verification (Optional Test)
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser123",
    "password": "Test123!@#"
  }'
```

**Expected Response (Before Verification):**
```json
{
  "statusCode": 401,
  "message": "Please verify your email before logging in"
}
```

### Step 5: Login After Verification
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser123",
    "password": "Test123!@#"
  }'
```

**Expected Response (After Verification):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "viewer"
}
```

## Test Invalid Token

### Test Expired/Invalid Token
```bash
curl http://localhost:3001/auth/verify-email/invalid-token-12345
```

**Expected Result:**
- Red error page with ❌ icon
- "Verification Failed" message
- Error details displayed

## Frontend Testing

### Step 1: Open Registration Page
```
http://localhost:3000/register
```

### Step 2: Fill Out Form
- Email: your-email@example.com
- Username: testuser456
- Password: Test123!@# (must meet requirements)
- Confirm Password: Test123!@#

### Step 3: Submit
- Click "Register"
- See success message
- Check email

### Step 4: Verify Email
- Click link in email
- See success page

### Step 5: Login
```
http://localhost:3000/login
```
- Username: testuser456
- Password: Test123!@#
- Should login successfully

## Troubleshooting

### Email Not Received?
1. Check spam folder
2. Check Resend dashboard for delivery status
3. Check backend console for errors
4. Verify `RESEND_API_KEY` is correct in `.env`

### Verification Link Not Working?
1. Check token hasn't expired (24 hours)
2. Check backend is running on port 3001
3. Check console for errors

### Can't Login After Verification?
1. Check MongoDB - user should have `isEmailVerified: true`
2. Check token was cleared from database
3. Try registering a new user

## Database Verification

### Check User in MongoDB
```bash
mongosh vehicle-history-system
db.users.findOne({ username: "testuser123" })
```

**Before Verification:**
```json
{
  "_id": ObjectId("..."),
  "email": "your-email@example.com",
  "username": "testuser123",
  "isEmailVerified": false,
  "emailVerificationToken": "abc123...",
  "emailVerificationExpires": ISODate("2025-12-04T...")
}
```

**After Verification:**
```json
{
  "_id": ObjectId("..."),
  "email": "your-email@example.com",
  "username": "testuser123",
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "emailVerificationExpires": null
}
```

## Success Criteria

✅ User can register with email
✅ Verification email is sent
✅ Email contains working verification link
✅ Clicking link verifies email
✅ Unverified users cannot login
✅ Verified users can login successfully
✅ Invalid tokens show error page
✅ Expired tokens show error message
