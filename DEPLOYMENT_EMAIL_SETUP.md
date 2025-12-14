# Email Verification - Production Deployment Guide

## Current Status
✅ Email verification is fully implemented
✅ Development mode available for local testing
⚠️ Requires domain verification for production

## For Local Development (Current Setup)

### Option 1: Development Mode (Recommended)
Set in `backend/.env`:
```env
DEV_MODE_AUTO_VERIFY=true
```
- Users are auto-verified on registration
- No emails sent
- Can login immediately
- Perfect for testing

### Option 2: Test with Your Resend Email
Register using: `wajihzouinhki22@gmail.com`
- This is your Resend account email
- Emails will be delivered
- Other emails will be blocked

## For Production Deployment

### Step 1: Get a Domain
You need to own a domain name. Options:
- **Namecheap**: ~$10/year (.com)
- **GoDaddy**: ~$12/year (.com)
- **Google Domains**: ~$12/year (.com)
- **Cloudflare**: ~$10/year (.com)

Example domain: `lajoiedechicha.com`

### Step 2: Verify Domain with Resend

1. **Login to Resend**
   - Go to https://resend.com
   - Login with your account

2. **Add Domain**
   - Go to https://resend.com/domains
   - Click "Add Domain"
   - Enter your domain: `lajoiedechicha.com`

3. **Add DNS Records**
   Resend will provide DNS records like:
   ```
   Type: TXT
   Name: _resend
   Value: resend-verify=abc123xyz...
   
   Type: MX
   Name: @
   Value: feedback-smtp.resend.com
   Priority: 10
   ```

4. **Configure DNS at Your Domain Registrar**
   - Login to your domain registrar (Namecheap, GoDaddy, etc.)
   - Go to DNS settings
   - Add the records Resend provided
   - Save changes

5. **Wait for Verification**
   - Usually takes 5-30 minutes
   - Resend will show "Verified" status when ready

### Step 3: Update Production Environment Variables

In your production server's `.env` file:

```env
# MongoDB (use production database)
MONGODB_URI=mongodb+srv://your-production-db-connection-string

# JWT
JWT_SECRET=your-super-secure-production-secret-change-this
JWT_EXPIRATION=24h

# Server
PORT=3001

# Email Configuration
RESEND_API_KEY=re_your_production_api_key
FROM_EMAIL=noreply@lajoiedechicha.com
APP_URL=https://lajoiedechicha.com

# IMPORTANT: Disable dev mode in production
DEV_MODE_AUTO_VERIFY=false
```

### Step 4: Update Email Service (Optional)
If you want to use your domain in the email template, update `backend/src/auth/email.service.ts`:

```typescript
const verificationUrl = `${process.env.APP_URL}/auth/verify-email/${token}`;
```

This already uses `APP_URL` from environment variables, so it will automatically work with your production domain.

### Step 5: Test in Production
1. Deploy your application
2. Register a new user with any email
3. Check that email inbox
4. Click verification link
5. Login successfully

## Resend Pricing

### Free Tier
- ✅ 100 emails per day
- ✅ 3,000 emails per month
- ✅ Perfect for small applications
- ✅ No credit card required

### Paid Plans
- **Pro**: $20/month - 50,000 emails/month
- **Business**: Custom pricing for higher volumes

Check latest pricing: https://resend.com/pricing

## Alternative Email Services

If you don't want to use Resend, here are alternatives:

### 1. SendGrid
- **Free**: 100 emails/day forever
- **Pros**: No domain verification for testing
- **Cons**: Requires verification for production
- **Website**: https://sendgrid.com

### 2. Mailgun
- **Free**: 5,000 emails/month for 3 months
- **Pros**: Good documentation
- **Cons**: Requires domain verification
- **Website**: https://mailgun.com

### 3. AWS SES (Simple Email Service)
- **Pricing**: $0.10 per 1,000 emails (very cheap!)
- **Pros**: Extremely reliable, cheap at scale
- **Cons**: More complex setup, requires domain verification
- **Website**: https://aws.amazon.com/ses/

### 4. Postmark
- **Free**: 100 emails/month
- **Pros**: Great deliverability
- **Cons**: Expensive for high volume
- **Website**: https://postmarkapp.com

## Switching Email Providers

If you want to switch from Resend to another provider, you'll need to:

1. Install the new provider's SDK
2. Update `backend/src/auth/email.service.ts`
3. Update environment variables

Example for SendGrid:
```bash
npm install @sendgrid/mail
```

## Security Checklist for Production

- [ ] Set `DEV_MODE_AUTO_VERIFY=false`
- [ ] Use strong `JWT_SECRET` (random 64+ characters)
- [ ] Use production MongoDB database
- [ ] Verify domain with email provider
- [ ] Update `APP_URL` to production domain
- [ ] Test email delivery
- [ ] Monitor email sending logs
- [ ] Set up email bounce handling (optional)
- [ ] Configure SPF/DKIM records (for better deliverability)

## Monitoring Email Delivery

### Resend Dashboard
- View sent emails: https://resend.com/emails
- Check delivery status
- View bounce/complaint rates
- Monitor API usage

### Logs
The application logs email sending attempts:
```
📧 Attempting to send verification email...
   To: user@example.com
   From: noreply@lajoiedechicha.com
   API Key configured: true
✅ Email sent successfully!
```

## Troubleshooting Production Issues

### Emails Not Arriving
1. Check spam folder
2. Verify domain is verified in Resend
3. Check Resend dashboard for delivery status
4. Verify `FROM_EMAIL` uses your verified domain
5. Check DNS records are correct

### "Domain not verified" Error
- Wait 30 minutes after adding DNS records
- Check DNS records are correct
- Use DNS checker: https://mxtoolbox.com

### Rate Limit Errors
- Check you haven't exceeded free tier limits
- Upgrade to paid plan if needed
- Implement rate limiting on registration

## Cost Estimation

### Small Application (< 100 users/month)
- **Resend Free**: $0/month ✅
- **Domain**: ~$10/year
- **Total**: ~$1/month

### Medium Application (1,000 users/month)
- **Resend Free**: $0/month (within limits) ✅
- **Domain**: ~$10/year
- **Total**: ~$1/month

### Large Application (10,000 users/month)
- **Resend Pro**: $20/month
- **Domain**: ~$10/year
- **Total**: ~$21/month

## Summary

**For Development (Now):**
- Set `DEV_MODE_AUTO_VERIFY=true`
- Test without sending emails

**For Production (When Deploying):**
1. Buy a domain (~$10/year)
2. Verify domain with Resend (free)
3. Set `DEV_MODE_AUTO_VERIFY=false`
4. Update `FROM_EMAIL` and `APP_URL`
5. Deploy and test

**Cost:** ~$1/month (just domain cost, Resend free tier is enough for most apps)

---

Need help with deployment? Let me know! 🚀
