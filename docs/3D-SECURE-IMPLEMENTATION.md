# 3D Secure Implementation Guide

This document outlines the 3D Secure (3DS) implementation for the Stripe payment system.

## Overview

3D Secure is a security protocol that adds an extra layer of authentication for online card payments. This implementation provides comprehensive 3D Secure support for both Checkout Sessions and Payment Intents.

## Features

- **Automatic 3D Secure**: Automatically requests 3D Secure authentication when required
- **Enhanced Security**: Supports both 3D Secure 1.0 and 3D Secure 2.0
- **Seamless UX**: Handles authentication flows with minimal user friction
- **Webhook Support**: Processes 3D Secure events via webhooks
- **Error Handling**: Comprehensive error handling for authentication failures

## Configuration

### Environment Variables

Ensure these environment variables are set:

```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CONNECTED_ACCOUNT_ID=acct_...
```

### 3D Secure Settings

The implementation uses the following 3D Secure configuration:

```typescript
{
  payment_method_options: {
    card: {
      request_three_d_secure: "automatic", // or "any", "challenge_only"
      setup_future_usage: "off_session",
    },
  },
  automatic_payment_methods: {
    enabled: true,
    allow_redirects: "always",
  },
}
```

## Implementation Details

### 1. Checkout Sessions

The existing checkout session creation has been enhanced with 3D Secure support:

```typescript
// app/actions/payment.ts
const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  payment_intent_data: {
    ...get3DSecureConfig(amount * 100, "gbp"),
    // ... other configuration
  },
  // ... rest of configuration
})
```

### 2. Payment Intents

New payment intent creation with enhanced 3D Secure support:

```typescript
// app/actions/payment.ts
export async function createPaymentIntent(
  projectId: string,
  amount: number,
  userEmail: string,
  paymentType: "deposit" | "final",
  captchaToken?: string,
) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "gbp",
    ...get3DSecureConfig(amount * 100, "gbp"),
    // ... other configuration
  })
}
```

### 3. Client-Side Components

#### ThreeDSecurePayment Component

A React component that handles 3D Secure authentication:

```typescript
// components/3d-secure-payment.tsx
export function ThreeDSecurePayment({
  clientSecret,
  amount,
  projectId,
  paymentType,
  onSuccess,
  onCancel,
}: ThreeDSecurePaymentProps) {
  // Handles payment confirmation and 3D Secure authentication
}
```

#### Secure Payment Page

A dedicated page for 3D Secure payments:

```typescript
// app/payment/secure/page.tsx
export default function SecurePaymentPage() {
  // Initializes Stripe Elements and handles payment flow
}
```

### 4. Webhook Handling

Enhanced webhook to handle 3D Secure events:

```typescript
// app/api/stripe/webhook/route.ts
switch (event.type) {
  case "payment_intent.succeeded":
    // Handle successful payment
    break
  case "payment_intent.payment_failed":
    // Handle failed payment
    break
  case "payment_intent.requires_action":
    // Handle 3D Secure authentication required
    break
  case "payment_intent.canceled":
    // Handle canceled payment
    break
}
```

## API Endpoints

### Create Payment Intent

```http
POST /api/stripe/create-payment-intent
Content-Type: application/json

{
  "projectId": "project_123",
  "amount": 100.00,
  "userEmail": "user@example.com",
  "paymentType": "deposit",
  "captchaToken": "optional_captcha_token"
}
```

### Confirm Payment Intent

```http
POST /api/stripe/confirm-payment-intent
Content-Type: application/json

{
  "paymentIntentId": "pi_1234567890"
}
```

## Usage Examples

### 1. Using Checkout Sessions (Existing)

```typescript
import { createCheckoutSession } from "@/app/actions/payment"

const { url } = await createCheckoutSession(
  projectId,
  amount,
  userEmail,
  "deposit",
  captchaToken
)

// Redirect to Stripe Checkout
window.location.href = url
```

### 2. Using Payment Intents (New)

```typescript
import { createSecurePaymentIntent } from "@/lib/stripe-client"

const result = await createSecurePaymentIntent(
  projectId,
  amount,
  userEmail,
  "deposit",
  captchaToken
)

// Use the client secret with Stripe Elements
```

### 3. Using the 3D Secure Component

```typescript
import { ThreeDSecurePayment } from "@/components/3d-secure-payment"

<Elements stripe={stripePromise} options={{ clientSecret }}>
  <ThreeDSecurePayment
    clientSecret={clientSecret}
    amount={amount}
    projectId={projectId}
    paymentType="deposit"
    onSuccess={handleSuccess}
    onCancel={handleCancel}
  />
</Elements>
```

## Security Features

### 1. Rate Limiting

All payment endpoints include rate limiting:

```typescript
const limiter = new RateLimiter({ 
  windowSeconds: 60, 
  maxRequests: 10, 
  prefix: "payment_intent" 
})
```

### 2. CAPTCHA Verification

Optional CAPTCHA verification for additional security:

```typescript
const captcha = await verifyTurnstileToken({ 
  token: captchaToken, 
  remoteIp: ip 
})
```

### 3. User Agent Blocking

Blocks suspicious user agents:

```typescript
if (isBlockedUserAgent(userAgent)) {
  throw new Error("Blocked user agent")
}
```

## Error Handling

The implementation includes comprehensive error handling:

1. **Payment Errors**: Handles card errors, validation errors, and network issues
2. **3D Secure Errors**: Manages authentication failures and timeouts
3. **Webhook Errors**: Processes webhook signature verification failures
4. **Rate Limiting**: Handles rate limit exceeded scenarios

## Testing

### Test Cards for 3D Secure

Use these test cards to test 3D Secure authentication:

- **3D Secure 2.0**: `4000 0025 0000 3155`
- **3D Secure 1.0**: `4000 0000 0000 0002`
- **No 3D Secure**: `4000 0000 0000 0002`

### Test Scenarios

1. **Successful 3D Secure**: Use a card that requires authentication
2. **Failed 3D Secure**: Use a card that fails authentication
3. **No 3D Secure**: Use a card that doesn't require authentication
4. **Network Errors**: Test with poor network conditions

## Monitoring

### Webhook Events

Monitor these webhook events for 3D Secure activity:

- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `payment_intent.requires_action`
- `payment_intent.canceled`

### Logging

The implementation includes comprehensive logging:

```typescript
console.log("Payment requires action (3D Secure):", paymentIntent.id)
console.log("Payment failed:", paymentIntent.id, paymentIntent.last_payment_error)
```

## Best Practices

1. **Always handle 3D Secure**: Don't disable 3D Secure for security reasons
2. **Test thoroughly**: Test with various cards and scenarios
3. **Monitor webhooks**: Ensure webhook endpoints are reliable
4. **Handle errors gracefully**: Provide clear error messages to users
5. **Use HTTPS**: Always use HTTPS in production
6. **Validate inputs**: Validate all payment inputs server-side

## Troubleshooting

### Common Issues

1. **3D Secure not triggering**: Check card type and amount
2. **Authentication failures**: Verify webhook configuration
3. **Redirect issues**: Ensure return URLs are correct
4. **Webhook errors**: Check webhook secret and signature

### Debug Mode

Enable debug logging by setting:

```env
NODE_ENV=development
```

This will provide detailed logs for debugging 3D Secure issues.

## Support

For issues related to 3D Secure implementation:

1. Check Stripe documentation: https://stripe.com/docs/3d-secure
2. Review webhook logs for errors
3. Test with Stripe's test cards
4. Contact support if issues persist
