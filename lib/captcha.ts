export async function verifyTurnstileToken(options: {
  token: string | undefined | null
  remoteIp?: string | null
}): Promise<{ success: boolean; error?: string }> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY

  if (!secretKey) {
    // If not configured, treat as success to avoid breaking environments
    return { success: true }
  }

  if (!options.token) {
    return { success: false, error: "Missing CAPTCHA token" }
  }

  const formData = new URLSearchParams()
  formData.append("secret", secretKey)
  formData.append("response", options.token)
  if (options.remoteIp) {
    formData.append("remoteip", options.remoteIp)
  }

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    })

    const data = (await res.json()) as { success: boolean; "error-codes"?: string[] }
    if (!data.success) {
      return { success: false, error: data["error-codes"]?.join(", ") || "CAPTCHA verification failed" }
    }
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err?.message || "CAPTCHA verification error" }
  }
}