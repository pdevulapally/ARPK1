export async function generateProjectInvoice(projectId: string, customerId: string, amount: number, description: string) {
  try {
    const response = await fetch('/api/stripe/generate-invoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectId,
        customerId,
        amount,
        description,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate invoice')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error generating invoice:', error)
    throw error
  }
}

// Create a payment intent with 3D Secure support
export async function createSecurePaymentIntent(
  projectId: string,
  amount: number,
  userEmail: string,
  paymentType: "deposit" | "final",
  captchaToken?: string
) {
  try {
    const response = await fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectId,
        amount,
        userEmail,
        paymentType,
        captchaToken,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to create payment intent')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error creating payment intent:', error)
    throw error
  }
}

// Confirm a payment intent after 3D Secure authentication
export async function confirmPaymentIntent(paymentIntentId: string) {
  try {
    const response = await fetch('/api/stripe/confirm-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentIntentId,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to confirm payment intent')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error confirming payment intent:', error)
    throw error
  }
}