export async function verifyRecaptchaToken(options: {
  token: string | undefined | null
  remoteIp?: string | null
}): Promise<{ success: boolean; error?: string }> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY

  if (!secretKey) {
    // If not configured, treat as success to avoid breaking environments
    console.warn("RECAPTCHA_SECRET_KEY not configured, skipping CAPTCHA verification")
    return { success: true }
  }

  if (!options.token) {
    console.warn("No CAPTCHA token provided")
    return { success: false, error: "Missing CAPTCHA token" }
  }

  console.log("Verifying reCAPTCHA token:", options.token.substring(0, 10) + "...")

  const formData = new URLSearchParams()
  formData.append("secret", secretKey)
  formData.append("response", options.token)
  if (options.remoteIp) {
    formData.append("remoteip", options.remoteIp)
  }

  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    })

    const data = (await res.json()) as { success: boolean; "error-codes"?: string[] }
    console.log("reCAPTCHA verification response:", data)
    if (!data.success) {
      return { success: false, error: data["error-codes"]?.join(", ") || "reCAPTCHA verification failed" }
    }
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err?.message || "reCAPTCHA verification error" }
  }
}

// Keep the old function name for backward compatibility
export const verifyTurnstileToken = verifyRecaptchaToken
