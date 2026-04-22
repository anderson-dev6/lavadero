/** Traduce errores comunes de Supabase Auth al español para el usuario final. */
export function mensajeErrorLogin(mensajeOriginal: string): string {
  const m = mensajeOriginal.toLowerCase()

  if (m.includes('email not confirmed') || m.includes('email_not_confirmed')) {
    return (
      'Tu cuenta existe, pero el correo aún no está confirmado. ' +
      'Revisa tu bandeja de entrada y spam: debe haber un enlace de Supabase. ' +
      'Al abrirlo y confirmar, podrás iniciar sesión. ' +
      '(Si estás en pruebas, el dueño del proyecto puede desactivar esta exigencia en Supabase: Authentication → Providers → Email → desactivar «Confirm email».)'
    )
  }

  if (
    m.includes('invalid login credentials') ||
    m.includes('invalid_credentials')
  ) {
    return 'Correo o contraseña incorrectos.'
  }

  if (m.includes('user not found') || m.includes('user_not_found')) {
    return 'No existe una cuenta con ese correo.'
  }

  if (m.includes('too many requests') || m.includes('rate limit')) {
    return 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.'
  }

  return mensajeOriginal
}

export function esCorreoNoConfirmado(mensajeOriginal: string): boolean {
  const m = mensajeOriginal.toLowerCase()
  return m.includes('email not confirmed') || m.includes('email_not_confirmed')
}
