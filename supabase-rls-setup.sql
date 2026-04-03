-- ============================================
-- SCRIPT SQL PARA SUPABASE - CONFIGURAR RLS
-- ============================================
-- Ejecuta esto en el SQL Editor de Supabase
-- para permitir INSERT, UPDATE, DELETE públicos
-- ============================================

-- 1. Habilitar Row Level Security en la tabla articulos
ALTER TABLE articulos ENABLE ROW LEVEL SECURITY;

-- 2. Política para permitir INSERT a cualquier usuario
CREATE POLICY "Allow insert for all users"
ON articulos
FOR INSERT
TO public
WITH CHECK (true);

-- 3. Política para permitir SELECT a cualquier usuario
CREATE POLICY "Allow select for all users"
ON articulos
FOR SELECT
TO public
WITH CHECK (true);

-- 4. Política para permitir UPDATE a cualquier usuario
CREATE POLICY "Allow update for all users"
ON articulos
FOR UPDATE
TO public
WITH CHECK (true);

-- 5. Política para permitir DELETE a cualquier usuario
CREATE POLICY "Allow delete for all users"
ON articulos
FOR DELETE
TO public
WITH CHECK (true);

-- ============================================
-- VERIFICACIÓN DE LA ESTRUCTURA DE LA TABLA
-- ============================================
-- La tabla 'articulos' debe tener estas columnas:
-- - id (uuid, primary key, auto)
-- - titulo (text)
-- - contenido (text)
-- - resumen (text)
-- - etiqueta (text)
-- - autor (text)
-- - imagen_url (text)
-- - publicado (boolean)
-- - created_at (timestamp)
-- ============================================
