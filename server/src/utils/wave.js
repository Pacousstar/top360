const WAVE_API_BASE = process.env.WAVE_API_URL || 'https://api.wave.com/v1';
const WAVE_API_KEY = process.env.WAVE_API_KEY || '';
const WAVE_SECRET_KEY = process.env.WAVE_SECRET_KEY || '';

function isConfigured() {
  return !!(WAVE_API_KEY && WAVE_SECRET_KEY);
}

export async function createCheckoutSession({ amount, currency = 'XOF', clientReference, successUrl, errorUrl }) {
  if (!isConfigured()) {
    return mockCheckoutSession({ amount, clientReference });
  }

  const response = await fetch(`${WAVE_API_BASE}/checkout/sessions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${WAVE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: Math.round(amount),
      currency,
      client_reference: clientReference,
      success_url: successUrl,
      error_url: errorUrl,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Wave API error: ${error}`);
  }

  return response.json();
}

export async function getCheckoutSession(sessionId) {
  if (!isConfigured()) {
    return { status: 'completed' };
  }

  const response = await fetch(`${WAVE_API_BASE}/checkout/sessions/${sessionId}`, {
    headers: { 'Authorization': `Bearer ${WAVE_API_KEY}` },
  });

  if (!response.ok) {
    throw new Error('Failed to get checkout session');
  }

  return response.json();
}

export async function getBalance() {
  if (!isConfigured()) {
    return { balance: 0 };
  }

  const response = await fetch(`${WAVE_API_BASE}/balance`, {
    headers: { 'Authorization': `Bearer ${WAVE_API_KEY}` },
  });

  if (!response.ok) throw new Error('Failed to get balance');
  return response.json();
}

function mockCheckoutSession({ amount, clientReference }) {
  const sessionId = `mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return {
    id: sessionId,
    amount: Math.round(amount),
    currency: 'XOF',
    client_reference: clientReference,
    status: 'created',
    wave_launch_url: `/payment/callback?session_id=${sessionId}&status=success&reference=${clientReference}`,
    created_at: new Date().toISOString(),
    mock: true,
  };
}
