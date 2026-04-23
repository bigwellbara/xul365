// ============================================
// PAYMENT GATEWAY INTEGRATIONS
// EcoCash and Paynow for Zimbabwe
// ============================================

// ---- TYPES ----
export interface PaymentInitResult {
  reference: string
  redirectUrl: string | null
  instructions: string
}

export interface PaymentVerifyResult {
  verified: boolean
  amount: number
  currency: string
  reference: string
  reason?: string
}

// ---- BASE INTERFACE ----
export interface PaymentGateway {
  initiatePayment(input: {
    amount: number
    currency: "USD" | "ZiG"
    reference: string
    description: string
    customerPhone?: string
    customerEmail?: string
  }): Promise<PaymentInitResult>

  verifyPayment(reference: string): Promise<PaymentVerifyResult>
}

// ---- ECOCASH GATEWAY ----
export class EcoCashGateway implements PaymentGateway {
  private apiKey: string
  private apiUrl: string

  constructor() {
    this.apiKey = process.env.ECOCASH_API_KEY ?? ""
    this.apiUrl = process.env.ECOCASH_API_URL ?? "https://api.ecocash.co.zw"

    if (!this.apiKey) {
      throw new Error("ECOCASH_API_KEY is not set")
    }
  }

  async initiatePayment(input: {
    amount: number
    currency: "USD" | "ZiG"
    reference: string
    description: string
    customerPhone?: string
    customerEmail?: string
  }): Promise<PaymentInitResult> {
    try {
      const response = await fetch(`${this.apiUrl}/transactions/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          amount: input.amount,
          currency: input.currency,
          merchantReference: input.reference,
          description: input.description,
          subscriberMsisdn: input.customerPhone,
        }),
      })

      if (!response.ok) {
        throw new Error(`EcoCash error: ${response.statusText}`)
      }

      const data = await response.json() as {
        reference: string
        redirectUrl: string
      }

      return {
        reference: data.reference,
        redirectUrl: data.redirectUrl,
        instructions: `Please complete payment on your EcoCash app. Reference: ${input.reference}`,
      }
    } catch (error) {
      throw new Error(`EcoCash payment initiation failed: ${String(error)}`)
    }
  }

  async verifyPayment(reference: string): Promise<PaymentVerifyResult> {
    try {
      const response = await fetch(
        `${this.apiUrl}/transactions/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      )

      if (!response.ok) {
        return {
          verified: false,
          amount: 0,
          currency: "USD",
          reference,
          reason: "Transaction not found",
        }
      }

      const data = await response.json() as {
        status: string
        amount: number
        currency: string
        reference: string
      }

      return {
        verified: data.status === "SUCCESS",
        amount: data.amount,
        currency: data.currency,
        reference: data.reference,
        reason: data.status !== "SUCCESS" ? data.status : undefined,
      }
    } catch (error) {
      throw new Error(`EcoCash verification failed: ${String(error)}`)
    }
  }
}

// ---- PAYNOW GATEWAY ----
export class PaynowGateway implements PaymentGateway {
  private integrationId: string
  private integrationKey: string
  private apiUrl: string
  private returnUrl: string
  private resultUrl: string

  constructor() {
    this.integrationId = process.env.PAYNOW_INTEGRATION_ID ?? ""
    this.integrationKey = process.env.PAYNOW_INTEGRATION_KEY ?? ""
    this.apiUrl = "https://www.paynow.co.zw/interface/initiatetransaction"
    this.returnUrl = process.env.PAYNOW_RETURN_URL ?? ""
    this.resultUrl = process.env.PAYNOW_RESULT_URL ?? ""

    if (!this.integrationId || !this.integrationKey) {
      throw new Error("Paynow credentials are not set")
    }
  }

  async initiatePayment(input: {
    amount: number
    currency: "USD" | "ZiG"
    reference: string
    description: string
    customerPhone?: string
    customerEmail?: string
  }): Promise<PaymentInitResult> {
    try {
      // Build Paynow payload
      const payload = new URLSearchParams({
        id: this.integrationId,
        reference: input.reference,
        amount: input.amount.toFixed(2),
        additionalinfo: input.description,
        returnurl: this.returnUrl,
        resulturl: this.resultUrl,
        status: "Message",
        ...(input.customerEmail && { authemail: input.customerEmail }),
        ...(input.customerPhone && { phone: input.customerPhone }),
      })

      // Generate hash for security
      const hash = await this.generateHash(payload.toString())
      payload.append("hash", hash)

      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: payload.toString(),
      })

      const responseText = await response.text()
      const responseData = this.parsePaynowResponse(responseText)

      if (responseData["status"]?.toLowerCase() !== "ok") {
        throw new Error(`Paynow error: ${responseData["error"]}`)
      }

      return {
        reference: input.reference,
        redirectUrl: responseData["browserurl"] ?? null,
        instructions: `You will be redirected to Paynow to complete payment. Reference: ${input.reference}`,
      }
    } catch (error) {
      throw new Error(`Paynow payment initiation failed: ${String(error)}`)
    }
  }

  async verifyPayment(reference: string): Promise<PaymentVerifyResult> {
    try {
      const payload = new URLSearchParams({
        id: this.integrationId,
        reference,
      })

      const hash = await this.generateHash(payload.toString())
      payload.append("hash", hash)

      const response = await fetch(
        "https://www.paynow.co.zw/interface/checkpayment",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: payload.toString(),
        }
      )

      const responseText = await response.text()
      const data = this.parsePaynowResponse(responseText)

      const verified = data["status"]?.toLowerCase() === "paid"

      return {
        verified,
        amount: parseFloat(data["amount"] ?? "0"),
        currency: "USD",
        reference,
        reason: !verified ? data["status"] : undefined,
      }
    } catch (error) {
      throw new Error(`Paynow verification failed: ${String(error)}`)
    }
  }

  // Parse Paynow's key=value response format
  private parsePaynowResponse(response: string): Record<string, string> {
    return Object.fromEntries(
      response.split("&").map((pair) => {
        const [key, value] = pair.split("=")
        return [
          decodeURIComponent(key ?? ""),
          decodeURIComponent(value ?? ""),
        ]
      })
    )
  }

  // Generate SHA512 hash for Paynow security
  private async generateHash(data: string): Promise<string> {
    const message = data + this.integrationKey
    const msgBuffer = new TextEncoder().encode(message)
    const hashBuffer = await crypto.subtle.digest("SHA-512", msgBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase()
  }
}

// ---- GATEWAY FACTORY ----
export function createPaymentGateway(
  method: "ecocash" | "paynow"
): PaymentGateway {
  switch (method) {
    case "ecocash":
      return new EcoCashGateway()
    case "paynow":
      return new PaynowGateway()
    default:
      throw new Error(`Unsupported payment method: ${String(method)}`)
  }
}