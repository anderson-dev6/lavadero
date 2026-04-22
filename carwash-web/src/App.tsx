import { Navigate, Route, Routes } from 'react-router-dom'
import { PanelRedirect } from './components/PanelRedirect'
import { RoleRoute } from './components/RoleRoute'
import { AdminLayout } from './components/layouts/AdminLayout'
import { ClienteLayout } from './components/layouts/ClienteLayout'
import { EmpleadoLayout } from './components/layouts/EmpleadoLayout'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminEmpleados } from './pages/admin/AdminEmpleados'
import { AdminFinanzas } from './pages/admin/AdminFinanzas'
import { AdminInventario } from './pages/admin/AdminInventario'
import { AdminReservas } from './pages/admin/AdminReservas'
import { AdminServicios } from './pages/admin/AdminServicios'
import { ClienteAgendar } from './pages/cliente/ClienteAgendar'
import { ClienteHistorial } from './pages/cliente/ClienteHistorial'
import { ClienteInicio } from './pages/cliente/ClienteInicio'
import { ClienteReservas } from './pages/cliente/ClienteReservas'
import { EmpleadoServicios } from './pages/empleado/EmpleadoServicios'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { RecuperarContrasena } from './pages/RecuperarContrasena'
import { Register } from './pages/Register'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/recuperar" element={<RecuperarContrasena />} />
      <Route path="/panel" element={<PanelRedirect />} />

      <Route
        path="/admin"
        element={
          <RoleRoute allowedRoles={['admin']}>
            <AdminLayout />
          </RoleRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="servicios" element={<AdminServicios />} />
        <Route path="reservas" element={<AdminReservas />} />
        <Route path="finanzas" element={<AdminFinanzas />} />
        <Route path="empleados" element={<AdminEmpleados />} />
        <Route path="inventario" element={<AdminInventario />} />
      </Route>

      <Route
        path="/empleado"
        element={
          <RoleRoute allowedRoles={['empleado']}>
            <EmpleadoLayout />
          </RoleRoute>
        }
      >
        <Route index element={<EmpleadoServicios />} />
      </Route>

      <Route
        path="/cliente"
        element={
          <RoleRoute allowedRoles={['cliente']}>
            <ClienteLayout />
          </RoleRoute>
        }
      >
        <Route index element={<ClienteInicio />} />
        <Route path="agendar" element={<ClienteAgendar />} />
        <Route path="reservas" element={<ClienteReservas />} />
        <Route path="historial" element={<ClienteHistorial />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
