-- =============================================================================
-- Car-Wash Cereté — INSTALACIÓN COMPLETA PARA SUPABASE (SQL Editor)
-- =============================================================================
-- Copia TODO este archivo, pégalo en: Supabase → SQL Editor → New query → Run
--
-- Incluye: tablas, índices, trigger de perfiles, RLS, datos iniciales y
--           promoción a administrador (edita el correo en la PARTE 3).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1) Tablas
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  nombre text not null,
  telefono text,
  role text not null check (role in ('admin', 'empleado', 'cliente')),
  updated_at timestamptz default now()
);

create table if not exists public.empleados (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  activo boolean not null default true,
  created_at timestamptz default now()
);

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

create table if not exists public.productos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  cantidad_actual numeric not null default 0,
  cantidad_minima numeric not null default 0,
  unidad text not null default 'ud',
  updated_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- 2) Trigger: al crear usuario en Authentication → fila en profiles
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
exception
  when unique_violation then
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 3) Row Level Security (usuarios autenticados)
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.empleados enable row level security;
alter table public.servicios enable row level security;
alter table public.reservas enable row level security;
alter table public.productos enable row level security;

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
-- 4) Datos iniciales (empleados + inventario; no duplica si ya existen)
-- ---------------------------------------------------------------------------

insert into public.empleados (nombre, activo)
  values ('Empleado', true)
  on conflict (nombre) do nothing;

insert into public.productos (nombre, cantidad_actual, cantidad_minima, unidad)
select v.nombre, v.ca, v.cm, v.u
from (
  values
    ('Jabón concentrado', 8::numeric, 5::numeric, 'L'),
    ('Cera líquida', 3::numeric, 4::numeric, 'L'),
    ('Agua (estimado depósito)', 1200::numeric, 400::numeric, 'L')
) as v(nombre, ca, cm, u)
where not exists (
  select 1 from public.productos p where p.nombre = v.nombre
);

-- ---------------------------------------------------------------------------
-- 5) PROMOVER A ADMINISTRADOR (IMPORTANTE)
-- ---------------------------------------------------------------------------
-- Este UPDATE solo funciona si YA EXISTE un usuario en Authentication con el
-- correo indicado (debe coincidir exactamente). Si acabas de crear la base,
-- haz primero los pasos del archivo PASOS_INSTALACION.txt (crear usuario),
-- luego vuelve a ejecutar SOLO esta sección o edita el correo y ejecuta.
--
-- Edita entre comillas el correo del administrador:
-- ---------------------------------------------------------------------------

update public.profiles
set
  role = 'admin',
  nombre = 'Administrador',
  updated_at = now()
where id = (
  select id from auth.users where email = 'admin@carwash.local' limit 1
);

-- Si usas otro correo, cambia 'admin@carwash.local' arriba y ejecuta de nuevo.
-- Si el resultado dice "UPDATE 0", ese correo no existe en Auth todavía.
