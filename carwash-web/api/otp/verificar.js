import { supabase, supabaseAnon } from '../_lib/clients.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Método no permitido' })
  }

  try {
    const { telefono, codigo, nombre } = req.body
    if (!telefono || !codigo) {
      return res.status(400).json({ ok: false, message: 'Datos incompletos' })
    }

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

    await supabase
      .from('otp_requests')
      .update({ usado: true, verificado_en: new Date().toISOString() })
      .eq('id', otpData.id)

    const emailTemp = `${telefono.replace(/\D/g, '')}@carwash.local`
    const passwordTemp = Buffer.from(telefono.trim()).toString('base64').slice(0, 20)

    const { data: { users } } = await supabase.auth.admin.listUsers()
    const existingUser = users?.find(u => u.email === emailTemp)

    let authData
    if (existingUser) {
      const updates = { password: passwordTemp }
      if (nombre && nombre.trim()) {
        updates.user_metadata = {
          ...existingUser.user_metadata,
          nombre: nombre.trim(),
        }
      }
      await supabase.auth.admin.updateUserById(existingUser.id, updates)

      if (nombre && nombre.trim()) {
        await supabase
          .from('profiles')
          .update({ nombre: nombre.trim() })
          .eq('id', existingUser.id)
      }
      authData = { user: { ...existingUser, user_metadata: updates.user_metadata || existingUser.user_metadata } }
    } else {
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
}
