-- ============================================
-- DIAGNÓSTICO DE BASE DE DATOS
-- ============================================
-- Ejecuta esto en el SQL Editor de Supabase
-- para verificar el estado actual
-- ============================================

-- 1. Verificar si existe la tabla categorias
SELECT 
  'categorias' as tabla,
  COUNT(*) as registros
FROM information_schema.tables 
WHERE table_name = 'categorias';

-- 2. Ver registros en categorias
SELECT * FROM categorias ORDER BY nombre;

-- 3. Ver estructura de articulos
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'articulos'
ORDER BY ordinal_position;

-- 4. Ver todos los artículos con su categoría
SELECT 
  a.id,
  a.titulo,
  a.resumen,
  a.publicado,
  a.etiqueta,
  a.categoria_id,
  a.autor_id,
  a.autor,
  c.nombre as categoria_nombre,
  a.created_at
FROM articulos a
LEFT JOIN categorias c ON a.categoria_id = c.id
ORDER BY a.created_at DESC;

-- 5. Verificar RLS policies en articulos
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename IN ('articulos', 'categorias');

-- 6. Verificar si RLS está habilitado
SELECT 
  tablename,
  rowsecurity as rls_habilitado
FROM pg_tables
WHERE tablename IN ('articulos', 'categorias');

-- 7. Contar artículos por estado
SELECT 
  publicado,
  COUNT(*) as cantidad
FROM articulos
GROUP BY publicado;

-- 8. Verificar foreign keys
SELECT
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM 
  information_schema.table_constraints AS tc 
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'articulos';

-- ============================================
-- SCRIPT DE REPARACIÓN (EJECUTAR SI ES NECESARIO)
-- ============================================

-- Si la tabla categorias NO existe, crearla:
/*
CREATE TABLE IF NOT EXISTS categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  descripcion TEXT
);

INSERT INTO categorias (nombre, slug, descripcion) VALUES
  ('Recursos Educativos', 'recursos-educativos', 'Materiales y recursos para el aula'),
  ('Formación Docente', 'formacion-docente', 'Capacitación y desarrollo profesional'),
  ('Cursos', 'cursos', 'Programas y cursos disponibles'),
  ('Tecnología Educativa', 'tecnologia-educativa', 'Herramientas tecnológicas para educación')
ON CONFLICT (slug) DO NOTHING;
*/

-- Si faltan columnas en articulos, agregarlas:
/*
ALTER TABLE articulos 
ADD COLUMN IF NOT EXISTS categoria_id UUID REFERENCES categorias(id) ON DELETE SET NULL;

ALTER TABLE articulos 
ADD COLUMN IF NOT EXISTS autor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE articulos 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW());
*/

-- Si RLS no está habilitado o las policies faltan:
/*
ALTER TABLE articulos ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;

-- Políticas para categorias
DROP POLICY IF EXISTS "Allow select for all users" ON categorias;
CREATE POLICY "Allow select for all users"
ON categorias FOR SELECT TO public
USING (true);

-- Políticas para articulos
DROP POLICY IF EXISTS "Allow authenticated read all articles" ON articulos;
CREATE POLICY "Allow authenticated read all articles"
ON articulos FOR SELECT TO authenticated
USING (true);

DROP POLICY IF EXISTS "Allow insert for authenticated users" ON articulos;
CREATE POLICY "Allow insert for authenticated users"
ON articulos FOR INSERT TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update only for author" ON articulos;
CREATE POLICY "Allow update only for author"
ON articulos FOR UPDATE TO authenticated
USING (auth.uid() = autor_id OR autor_id IS NULL)
WITH CHECK (auth.uid() = autor_id OR autor_id IS NULL);

DROP POLICY IF EXISTS "Allow delete only for author" ON articulos;
CREATE POLICY "Allow delete only for author"
ON articulos FOR DELETE TO authenticated
USING (auth.uid() = autor_id OR autor_id IS NULL);
*/
