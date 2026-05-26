const API_BASE = import.meta.env.DEV ? 'http://localhost:3001' : import.meta.env.VITE_API_URL || ''

export async function solicitarCodigoOTP(telefono: string) {
  const response = await fetch(`${API_BASE}/api/otp/solicitar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ telefono }),
  })

  if (!response.ok) {
    const data = await response.json()
    return { ok: false as const, message: data.message || 'Error al solicitar código' }
  }

  return { ok: true as const, message: 'Código enviado por WhatsApp' }
}

export async function verificarCodigoOTP(telefono: string, codigo: string, nombre?: string) {
  const response = await fetch(`${API_BASE}/api/otp/verificar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ telefono, codigo, nombre }),
  })

  if (!response.ok) {
    const data = await response.json()
    return { ok: false as const, message: data.message || 'Error al verificar' }
  }

  const data = await response.json()
  return {
    ok: true as const,
    user: data.user,
    access_token: data.access_token,
    refresh_token: data.refresh_token,
  }
}
