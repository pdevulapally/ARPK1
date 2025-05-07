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