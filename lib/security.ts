export function getClientIpFromHeaders(headers: Headers): string | null {
  const xff = headers.get("x-forwarded-for") || headers.get("x-real-ip")
  if (xff) {
    // x-forwarded-for can be a comma-separated list
    const ip = xff.split(",")[0]?.trim()
    return ip || null
  }
  // Node/Next may expose remote address differently; fall back to empty
  return null
}

export function isBlockedUserAgent(userAgentRaw: string | null | undefined): boolean {
  const userAgent = (userAgentRaw || "").toLowerCase()
  if (!userAgent) return true // block empty/unknown UAs on sensitive endpoints

  const disallowedFragments = [
    "curl/",
    "httpie/",
    "wget/",
    "libwww-perl",
    "python-requests",
    "aiohttp",
    "okhttp",
    "java/",
    "go-http-client",
    "httpclient",
    "powershell",
    "postmanruntime",
    "insomnia",
    "bot",
    "spider",
    "crawler",
    "headless",
    "phantomjs",
    "selenium",
  ]

  return disallowedFragments.some((frag) => userAgent.includes(frag))
}