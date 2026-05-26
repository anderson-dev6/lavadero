import { twilioClient, TWILIO_WHATSAPP, supabase } from '../_lib/clients.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Método no permitido' })
  }

  try {
    const { clienteEmail, fechaHora, tipoServicio, tipoVehiculo, placa } = req.body
    if (!clienteEmail) {
      return res.status(400).json({ ok: false, message: 'Email cliente requerido' })
    }

    const { data: { users } } = await supabase.auth.admin.listUsers()
    const user = users?.find(u => u.email === clienteEmail)
    if (!user) {
      return res.status(404).json({ ok: false, message: 'Cliente no encontrado' })
    }

    const telefono = user.user_metadata?.telefono
    if (!telefono) {
      return res.status(400).json({ ok: false, message: 'Cliente sin teléfono' })
    }

    const fecha = new Date(fechaHora)
    const fechaStr = fecha.toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    const horaStr = fecha.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
    })

    const mensaje = `✅ *Reserva confirmada - Car-Wash Cereté*\n\n` +
      `Hola ${user.user_metadata?.nombre || 'Cliente'}, tu reserva fue confirmada:\n\n` +
      `📅 Fecha: ${fechaStr}\n` +
      `🕒 Hora: ${horaStr}\n` +
      `🚗 Vehículo: ${tipoVehiculo} (${placa})\n` +
      `🧼 Servicio: ${tipoServicio}\n\n` +
      `¡Te esperamos!`

    await twilioClient.messages.create({
      body: mensaje,
      from: TWILIO_WHATSAPP,
      to: `whatsapp:${telefono}`,
    })

    return res.json({ ok: true, message: 'Notificación enviada' })
  } catch (err) {
    console.error('Error WhatsApp:', err)
    res.status(500).json({ ok: false, message: 'Error al enviar mensaje' })
  }
}
