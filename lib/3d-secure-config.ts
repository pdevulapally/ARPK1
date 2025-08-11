// 3D Secure Configuration Constants
export const THREE_D_SECURE_CONFIG = {
  // Payment method options for 3D Secure
  PAYMENT_METHOD_OPTIONS: {
    card: {
      request_three_d_secure: "automatic" as const, // "automatic", "any", or "challenge_only"
      setup_future_usage: "off_session" as const,
    },
  },
  
  // Automatic payment methods configuration
  AUTOMATIC_PAYMENT_METHODS: {
    enabled: true,
    allow_redirects: "always" as const,
  },
  
  // Supported currencies for 3D Secure
  SUPPORTED_CURRENCIES: ["gbp", "eur", "usd"],
  
  // Minimum amounts that typically require 3D Secure (in cents)
  MIN_AMOUNTS: {
    gbp: 100, // £1.00
    eur: 100, // €1.00
    usd: 100, // $1.00
  },
}

// Helper function to determine if 3D Secure should be requested
export function shouldRequest3DSecure(amount: number, currency: string): boolean {
  const minAmount = THREE_D_SECURE_CONFIG.MIN_AMOUNTS[currency as keyof typeof THREE_D_SECURE_CONFIG.MIN_AMOUNTS] || 100
  return amount >= minAmount
}

// Helper function to get 3D Secure configuration based on amount and currency
export function get3DSecureConfig(amount: number, currency: string) {
  const shouldRequest = shouldRequest3DSecure(amount, currency)
  
  return {
    payment_method_options: {
      card: {
        request_three_d_secure: shouldRequest ? ("automatic" as const) : ("any" as const),
        setup_future_usage: "off_session" as const,
      },
    },
    automatic_payment_methods: THREE_D_SECURE_CONFIG.AUTOMATIC_PAYMENT_METHODS,
  }
}

// Helper function to format amount for display
export function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100) // Convert from cents
}

// Helper function to validate 3D Secure response
export function validate3DSecureResponse(paymentIntent: any): {
  isValid: boolean
  status: string
  requiresAction: boolean
  error?: string
} {
  if (!paymentIntent) {
    return {
      isValid: false,
      status: "invalid",
      requiresAction: false,
      error: "No payment intent provided",
    }
  }

  const validStatuses = ["succeeded", "processing", "requires_action", "requires_payment_method"]
  
  if (!validStatuses.includes(paymentIntent.status)) {
    return {
      isValid: false,
      status: paymentIntent.status,
      requiresAction: false,
      error: `Invalid payment status: ${paymentIntent.status}`,
    }
  }

  return {
    isValid: true,
    status: paymentIntent.status,
    requiresAction: paymentIntent.status === "requires_action",
  }
}
