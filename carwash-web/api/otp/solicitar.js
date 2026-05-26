import { twilioClient, TWILIO_WHATSAPP, supabase } from '../_lib/clients.js'

function generarCodigo() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Método no permitido' })
  }

  try {
    const { telefono } = req.body
    if (!telefono || typeof telefono !== 'string') {
      return res.status(400).json({ ok: false, message: 'Teléfono requerido' })
    }

    const codigo = generarCodigo()

    const { error } = await supabase.from('otp_requests').insert({
      telefono: telefono.trim(),
      codigo,
      intentos: 0,
      max_intentos: 5,
      usado: false,
    })

    if (error) {
      console.error('Error Supabase:', error)
      return res.status(500).json({ ok: false, message: 'Error al guardar código' })
    }

    try {
      await twilioClient.messages.create({
        body: `Tu código de verificación para Car-Wash Cereté es: ${codigo}\n\nNo lo compartas con nadie. Válido por 10 minutos.`,
        from: TWILIO_WHATSAPP,
        to: `whatsapp:${telefono.trim()}`,
      })
    } catch (twilioErr) {
      console.error('Error Twilio:', twilioErr)
      console.log(`[DEV] Código para ${telefono}: ${codigo}`)
    }

    return res.json({ ok: true, message: 'Código enviado por WhatsApp' })
  } catch (err) {
    console.error('Error servidor:', err)
    res.status(500).json({ ok: false, message: 'Error interno' })
  }
}
