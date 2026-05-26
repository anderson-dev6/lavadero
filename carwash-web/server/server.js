import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import twilio from 'twilio'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())

// Twilio
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)
const TWILIO_WHATSAPP = process.env.TWILIO_WHATSAPP_NUMBER

// Supabase admin (service role)
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Supabase normal (anon) - para hacer signInWithPassword
const supabaseAnon = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

// Generar código aleatorio 6 dígitos
function generarCodigo() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// POST /api/otp/solicitar - Solicitar código OTP
app.post('/api/otp/solicitar', async (req, res) => {
  try {
    const { telefono } = req.body
    if (!telefono || typeof telefono !== 'string') {
      return res.status(400).json({ ok: false, message: 'Teléfono requerido' })
    }

    // Generar código
    const codigo = generarCodigo()

    // Guardar en BD
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

    // Enviar por WhatsApp
    try {
      await twilioClient.messages.create({
        body: `Tu código de verificación para Car-Wash Cereté es: ${codigo}\n\nNo lo compartas con nadie. Válido por 10 minutos.`,
        from: TWILIO_WHATSAPP,
        to: `whatsapp:${telefono.trim()}`,
      })
    } catch (twilioErr) {
      console.error('Error Twilio:', twilioErr)
      // No fallar si Twilio falla, solo loguear
      console.log(`[DEV] Código para ${telefono}: ${codigo}`)
    }

    return res.json({ ok: true, message: 'Código enviado por WhatsApp' })
  } catch (err) {
    console.error('Error servidor:', err)
    res.status(500).json({ ok: false, message: 'Error interno' })
  }
})

// POST /api/otp/verificar - Verificar código y crear usuario
app.post('/api/otp/verificar', async (req, res) => {
  try {
    const { telefono, codigo, nombre } = req.body
    if (!telefono || !codigo) {
      return res.status(400).json({ ok: false, message: 'Datos incompletos' })
    }

    // Buscar código válido
    const { data: otpData, error: otpError } = await supabase
      .from('otp_requests')
      .select('*')
      .eq('telefono', telefono.trim())
      .eq('codigo', codigo.trim())
      .eq('usado', false)
      .gt('expira_en', 'now()')
      .order('creado_en', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (otpError) {
      console.error('Error Supabase:', otpError)
      return res.status(500).json({ ok: false, message: 'Error al verificar' })
    }

    if (!otpData) {
      return res.status(400).json({ ok: false, message: 'Código inválido o expirado' })
    }

    if (otpData.intentos >= otpData.max_intentos) {
      return res.status(400).json({ ok: false, message: 'Demasiados intentos. Solicita un nuevo código.' })
    }

    // Marcar como usado
    await supabase
      .from('otp_requests')
      .update({ usado: true, verificado_en: new Date().toISOString() })
      .eq('id', otpData.id)

    // Email temporal: teléfono@carwash.local
    const emailTemp = `${telefono.replace(/\D/g, '')}@carwash.local`
    // Password determinístico basado en teléfono
    const passwordTemp = Buffer.from(telefono.trim()).toString('base64').slice(0, 20)

    // Buscar usuario primero
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
    const existingUser = users?.find(u => u.email === emailTemp)

    let authData
    if (existingUser) {
      // Actualizar password y nombre si se envió
      const updates = { password: passwordTemp }
      if (nombre && nombre.trim()) {
        updates.user_metadata = {
          ...existingUser.user_metadata,
          nombre: nombre.trim(),
        }
      }
      await supabase.auth.admin.updateUserById(existingUser.id, updates)

      // Actualizar tabla profiles también
      if (nombre && nombre.trim()) {
        await supabase
          .from('profiles')
          .update({ nombre: nombre.trim() })
          .eq('id', existingUser.id)
      }
      authData = { user: { ...existingUser, user_metadata: updates.user_metadata || existingUser.user_metadata } }
    } else {
      // Usuario no existe: crear
      const { data, error: authError } = await supabase.auth.admin.createUser({
        email: emailTemp,
        password: passwordTemp,
        email_confirm: true,
        user_metadata: {
          nombre: nombre || 'Usuario',
          telefono: telefono.trim(),
          role: 'cliente',
        },
      })

      if (authError) {
        console.error('Error Auth:', authError)
        return res.status(500).json({ ok: false, message: 'Error al crear usuario' })
      }
      authData = data
    }

    // Login desde servidor para obtener tokens de sesión
    const { data: sessionData, error: sessionError } = await supabaseAnon.auth.signInWithPassword({
      email: emailTemp,
      password: passwordTemp,
    })

    if (sessionError || !sessionData?.session) {
      console.error('Error sesión:', sessionError)
      return res.status(500).json({ ok: false, message: 'Error al iniciar sesión' })
    }

    return res.json({
      ok: true,
      message: 'Verificado. Acceso concedido.',
      access_token: sessionData.session.access_token,
      refresh_token: sessionData.session.refresh_token,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        telefono: telefono.trim(),
        nombre: authData.user.user_metadata?.nombre || 'Usuario',
        role: authData.user.user_metadata?.role || 'cliente',
      },
    })
  } catch (err) {
    console.error('Error servidor:', err)
    res.status(500).json({ ok: false, message: 'Error interno' })
  }
})

// POST /api/whatsapp/reserva-confirmada - Notificar al cliente
app.post('/api/whatsapp/reserva-confirmada', async (req, res) => {
  try {
    const { clienteEmail, fechaHora, tipoServicio, tipoVehiculo, placa } = req.body
    if (!clienteEmail) {
      return res.status(400).json({ ok: false, message: 'Email cliente requerido' })
    }

    // Buscar usuario por email para obtener teléfono
    const { data: { users } } = await supabase.auth.admin.listUsers()
    const user = users?.find(u => u.email === clienteEmail)
    if (!user) {
      return res.status(404).json({ ok: false, message: 'Cliente no encontrado' })
    }

    const telefono = user.user_metadata?.telefono
    if (!telefono) {
      return res.status(400).json({ ok: false, message: 'Cliente sin teléfono' })
    }

    // Formatear fecha y hora
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
})

// Health check
app.get('/health', (req, res) => {
  res.json({ ok: true, message: 'Servidor activo' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Servidor OTP escuchando en puerto ${PORT}`)
  console.log(`Twilio WhatsApp: ${TWILIO_WHATSAPP}`)
})
