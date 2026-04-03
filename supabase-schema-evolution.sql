-- ============================================
-- EVOLUCIÓN DE BASE DE DATOS - PLATAFORMA EDUCATIVA
-- ============================================
-- Este script profesionaliza la estructura para:
-- 1. Múltiples autores con vinculación a auth.users
-- 2. Categorías fijas en tabla dedicada
-- 3. Foreign keys proper entre tablas
-- ============================================

-- ============================================
-- PASO 1: CREAR TABLA CATEGORIAS
-- ============================================
CREATE TABLE IF NOT EXISTS categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  descripcion TEXT
);

-- ============================================
-- PASO 2: INSERTAR CATEGORÍAS OBLIGATORIAS
-- ============================================
INSERT INTO categorias (nombre, slug, descripcion) VALUES
  ('Recursos Educativos', 'recursos-educativos', 'Materiales y recursos para el aula'),
  ('Formación Docente', 'formacion-docente', 'Capacitación y desarrollo profesional'),
  ('Cursos', 'cursos', 'Programas y cursos disponibles'),
  ('Tecnología Educativa', 'tecnologia-educativa', 'Herramientas tecnológicas para educación')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- PASO 3: AGREGAR COLUMNAS A ARTICULOS
-- ============================================

-- 3a. Agregar columna categoria_id (nullable para no romper registros existentes)
ALTER TABLE articulos 
ADD COLUMN IF NOT EXISTS categoria_id UUID REFERENCES categorias(id) ON DELETE SET NULL;

-- 3b. Agregar columna autor_id vinculada a auth.users (para validación de propietario)
ALTER TABLE articulos 
ADD COLUMN IF NOT EXISTS autor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 3c. Índice para mejorar rendimiento en consultas por categoría
CREATE INDEX IF NOT EXISTS idx_articulos_categoria ON articulos(categoria_id);

-- 3d. Índice para mejorar rendimiento en consultas por autor
CREATE INDEX IF NOT EXISTS idx_articulos_autor ON articulos(autor_id);

-- ============================================
-- PASO 4: MIGRAR DATOS EXISTENTES (OPCIONAL)
-- ============================================
-- Esto vincula la columna 'etiqueta' existente con la nueva tabla categorias
-- Ejecuta solo si tienes datos que quieras migrar

-- Actualizar categoria_id basado en la etiqueta existente
UPDATE articulos a
SET categoria_id = c.id
FROM categorias c
WHERE 
  LOWER(a.etiqueta) = LOWER(c.nombre)
  AND a.categoria_id IS NULL;

-- ============================================
-- PASO 5: POLÍTICAS RLS PARA CATEGORIAS
-- ============================================
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;

-- Todos pueden leer categorías
CREATE POLICY "Allow select for all users"
ON categorias FOR SELECT TO public
USING (true);

-- Solo usuarios autenticados pueden insertar/update/delete categorías
CREATE POLICY "Allow insert for authenticated users"
ON categorias FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow update for authenticated users"
ON categorias FOR UPDATE TO authenticated
USING (true);

CREATE POLICY "Allow delete for authenticated users"
ON categorias FOR DELETE TO authenticated
USING (true);

-- ============================================
-- PASO 6: POLÍTICAS RLS PARA ARTICULOS
-- ============================================
-- Nota: La tabla articulos ya debería tener RLS habilitado
-- Estas políticas aseguran que:
-- - Todos pueden leer artículos publicados
-- - Solo el autor puede editar/borrar sus artículos
-- - Usuarios autenticados pueden crear artículos

-- Permitir lectura pública de artículos publicados
CREATE POLICY "Allow public read of published articles"
ON articulos FOR SELECT TO public
USING (publicado = true OR auth.uid() IS NOT NULL);

-- Permitir lectura completa a usuarios autenticados (para el dashboard)
CREATE POLICY "Allow authenticated read all articles"
ON articulos FOR SELECT TO authenticated
USING (true);

-- Permitir insert a usuarios autenticados
CREATE POLICY "Allow insert for authenticated users"
ON articulos FOR INSERT TO authenticated
WITH CHECK (auth.uid() = autor_id OR autor_id IS NULL);

-- Permitir update SOLO al autor del artículo
CREATE POLICY "Allow update only for author"
ON articulos FOR UPDATE TO authenticated
USING (auth.uid() = autor_id)
WITH CHECK (auth.uid() = autor_id);

-- Permitir delete SOLO al autor del artículo
CREATE POLICY "Allow delete only for author"
ON articulos FOR DELETE TO authenticated
USING (auth.uid() = autor_id);

-- ============================================
-- PASO 7: FUNCIÓN PARA OBTENER ARTÍCULOS CON CATEGORÍA
-- ============================================
-- Esta función helper facilita obtener artículos con su categoría

CREATE OR REPLACE FUNCTION obtener_articulos_con_categoria()
RETURNS TABLE (
  id UUID,
  titulo TEXT,
  contenido TEXT,
  resumen TEXT,
  etiqueta TEXT,
  autor TEXT,
  autor_id UUID,
  imagen_url TEXT,
  publicado BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  categoria_id UUID,
  categoria_nombre TEXT,
  categoria_slug TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.titulo,
    a.contenido,
    a.resumen,
    a.etiqueta,
    a.autor,
    a.autor_id,
    a.imagen_url,
    a.publicado,
    a.created_at,
    a.updated_at,
    a.categoria_id,
    c.nombre AS categoria_nombre,
    c.slug AS categoria_slug
  FROM articulos a
  LEFT JOIN categorias c ON a.categoria_id = c.id
  ORDER BY a.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PASO 8: TRIGGER PARA ACTUALIZAR updated_at
-- ============================================
-- Agregar columna updated_at si no existe
ALTER TABLE articulos 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW());

-- Crear función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger
DROP TRIGGER IF EXISTS update_articulos_updated_at ON articulos;
CREATE TRIGGER update_articulos_updated_at
  BEFORE UPDATE ON articulos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VERIFICACIÓN FINAL
-- ============================================
-- Ejecuta estas consultas para verificar que todo está correcto:

-- SELECT * FROM categorias;
-- SELECT id, nombre, slug, categoria_id, autor_id FROM articulos LIMIT 10;

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================
-- 1. La columna 'etiqueta' se mantiene para compatibilidad
-- 2. La columna 'autor' (texto) se mantiene para mostrar nombre visible
-- 3. autor_id es la referencia real al usuario en auth.users
-- 4. categoria_id es nullable para no romper registros antiguos
-- 5. Para nuevos artículos, SIEMPRE establecer autor_id = auth.uid()
