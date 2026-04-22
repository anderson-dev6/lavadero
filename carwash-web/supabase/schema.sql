-- Car-Wash Cereté — ejecutar en Supabase → SQL Editor (todo el script de una vez).
-- Requiere extensión pgcrypto para gen_random_uuid (habitualmente ya activa en Supabase).

-- ---------------------------------------------------------------------------
-- Perfiles ligados a auth.users (rol: admin | empleado | cliente)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  nombre text not null,
  telefono text,
  role text not null check (role in ('admin', 'empleado', 'cliente')),
  updated_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- Empleados del lavadero (nombre mostrado en servicios)
-- ---------------------------------------------------------------------------
create table if not exists public.empleados (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  activo boolean not null default true,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- Servicios de lavado
-- ---------------------------------------------------------------------------
create table if not exists public.servicios (
  id uuid primary key default gen_random_uuid(),
  placa text not null,
  tipo_vehiculo text not null,
  tipo_servicio text not null,
  hora_entrada text not null,
  hora_salida text,
  estado text not null,
  empleado_asignado text not null,
  precio numeric not null,
  fecha date not null,
  metodo_pago text,
  created_at timestamptz default now()
);

create index if not exists idx_servicios_fecha on public.servicios (fecha);
create index if not exists idx_servicios_estado on public.servicios (estado);

-- ---------------------------------------------------------------------------
-- Reservas / citas
-- ---------------------------------------------------------------------------
create table if not exists public.reservas (
  id uuid primary key default gen_random_uuid(),
  cliente_email text not null,
  cliente_nombre text not null,
  fecha_hora timestamptz not null,
  tipo_servicio text not null,
  placa text not null,
  tipo_vehiculo text not null,
  estado text not null,
  created_at timestamptz default now()
);

create index if not exists idx_reservas_fecha_hora on public.reservas (fecha_hora);
create index if not exists idx_reservas_cliente_email on public.reservas (cliente_email);

-- ---------------------------------------------------------------------------
-- Inventario
-- ---------------------------------------------------------------------------
create table if not exists public.productos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  cantidad_actual numeric not null default 0,
  cantidad_minima numeric not null default 0,
  unidad text not null default 'ud',
  updated_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- Trigger: al registrarse un usuario en Auth, crear fila en profiles
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nombre, telefono, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nombre', split_part(coalesce(new.email, 'usuario'), '@', 1)),
    nullif(trim(coalesce(new.raw_user_meta_data->>'telefono', '')), ''),
    coalesce(nullif(trim(coalesce(new.raw_user_meta_data->>'role', '')), ''), 'cliente')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.empleados enable row level security;
alter table public.servicios enable row level security;
alter table public.reservas enable row level security;
alter table public.productos enable row level security;

-- Políticas: usuarios autenticados pueden operar (la app filtra por rol en UI).
-- Para producción, endurecer con políticas por rol y/o funciones auxiliares.

drop policy if exists "profiles_auth_all" on public.profiles;
create policy "profiles_auth_all"
  on public.profiles for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "empleados_auth_all" on public.empleados;
create policy "empleados_auth_all"
  on public.empleados for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "servicios_auth_all" on public.servicios;
create policy "servicios_auth_all"
  on public.servicios for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "reservas_auth_all" on public.reservas;
create policy "reservas_auth_all"
  on public.reservas for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "productos_auth_all" on public.productos;
create policy "productos_auth_all"
  on public.productos for all
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- Datos iniciales (opcional — ejecutar una sola vez)
-- ---------------------------------------------------------------------------
insert into public.empleados (nombre, activo)
  values ('Empleado', true)
  on conflict (nombre) do nothing;

insert into public.productos (nombre, cantidad_actual, cantidad_minima, unidad)
  values
    ('Jabón concentrado', 8, 5, 'L'),
    ('Cera líquida', 3, 4, 'L'),
    ('Agua (estimado depósito)', 1200, 400, 'L');
