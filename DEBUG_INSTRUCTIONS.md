# 🔍 DEBUG - PROBLEMAS DE CONEXIÓN CON SUPABASE

## Problema Reportado
- ❌ No muestra artículos guardados
- ❌ No muestra lista de categorías

---

## 🚀 PASOS PARA DEBUGUEAR

### PASO 1: Ejecutar la App en Modo Desarrollo

```bash
npm run dev
```

Abre tu navegador en `http://localhost:3000`

---

### PASO 2: Ir a la Página de Debug

Accede a: **http://localhost:3000/debug**

Esta página muestra:
- ✅ Estado de la conexión con Supabase
- ✅ Variables de entorno
- ✅ Categorías encontradas
- ✅ Artículos encontrados
- ✅ Logs detallados

**Toma captura de pantalla de lo que veas** y envíala para diagnosticar.

---

### PASO 3: Revisar la Consola del Navegador

1. Presiona `F12` para abrir DevTools
2. Ve a la pestaña **Console**
3. Busca logs que empiecen con:
   - `🔵 [CATEGORIAS]`
   - `🔵 [ARTICULOS]`
   - `🔵 [ESTADISTICAS]`
   - `❌` (errores en rojo)

---

### PASO 4: Verificar en Supabase

1. Ve a https://supabase.com
2. Entra a tu proyecto `jetjlftghxhzrbmlzjeh`
3. Ve a **SQL Editor**
4. Ejecuta el archivo `supabase-diagnostico.sql`

Esto te dirá:
- Si la tabla `categorias` existe
- Cuántos registros hay en cada tabla
- Si las políticas RLS están configuradas
- Si las foreign keys están correctas

---

## 📋 POSIBLES CAUSAS Y SOLUCIONES

### Causa 1: Tabla `categorias` no existe

**Síntoma:** Error "relation categorias does not exist"

**Solución:** Ejecuta en SQL Editor:

```sql
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
```

---

### Causa 2: RLS bloqueando las consultas

**Síntoma:** "permission denied for table"

**Solución:** Ejecuta en SQL Editor:

```sql
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE articulos ENABLE ROW LEVEL SECURITY;

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
```

---

### Causa 3: Variables de entorno no se cargan

**Síntoma:** En `/debug` ves `undefined` en las variables

**Solución:**
1. Verifica que `.env.local` existe en la raíz del proyecto
2. Reinicia el servidor (`Ctrl+C` y `npm run dev`)
3. Limpia caché: `rm -rf .next && npm run dev`

---

### Causa 4: Tabla `articulos` no tiene las columnas nuevas

**Síntoma:** Error en columnas `categoria_id` o `autor_id`

**Solución:** Ejecuta en SQL Editor:

```sql
ALTER TABLE articulos 
ADD COLUMN IF NOT EXISTS categoria_id UUID REFERENCES categorias(id) ON DELETE SET NULL;

ALTER TABLE articulos 
ADD COLUMN IF NOT EXISTS autor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE articulos 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW());

CREATE INDEX IF NOT EXISTS idx_articulos_categoria ON articulos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_articulos_autor ON articulos(autor_id);
```

---

## 🧪 COMANDOS DE VERIFICACIÓN RÁPIDA

### En el navegador (consola):

```javascript
// Verificar variables de entorno
console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
```

### En Supabase SQL Editor:

```sql
-- Ver categorías
SELECT * FROM categorias;

-- Ver artículos
SELECT id, titulo, publicado, categoria_id, autor_id FROM articulos;

-- Ver estructura
\d articulos
\d categorias
```

---

## 📊 ARCHIVOS DE DIAGNÓSTICO CREADOS

| Archivo | Propósito |
|---------|-----------|
| `/debug` (ruta) | Página web de diagnóstico |
| `components/TestSupabase.jsx` | Componente de test en dashboard |
| `supabase-diagnostico.sql` | SQL para verificar BD |

---

## 🆘 INFORMACIÓN PARA SOPORTE

Si necesitas ayuda, proporciona:

1. **Captura de `/debug`** - Muestra el estado de la conexión
2. **Logs de la consola** - Copia y pega los errores
3. **Resultado del SQL de diagnóstico** - Ejecuta `supabase-diagnostico.sql`

---

## ✅ CHECKLIST DE VERIFICACIÓN

- [ ] `.env.local` existe con las credenciales correctas
- [ ] Servidor reiniciado después de crear `.env.local`
- [ ] Tabla `categorias` existe con 4 registros
- [ ] Tabla `articulos` tiene columnas `categoria_id` y `autor_id`
- [ ] Políticas RLS configuradas para ambas tablas
- [ ] Página `/debug` carga sin errores
- [ ] Consola del navegador muestra logs de las consultas

---

## 🔗 RUTAS ÚTILES

| Ruta | Propósito |
|------|-----------|
| `/debug` | Diagnóstico completo |
| `/dashboard` | Dashboard con test integrado |
| `/login` | Iniciar sesión |

---

**NOTA:** El componente `TestSupabase` en el dashboard está temporal. Una vez resuelto el problema, puedes eliminarlo del archivo `app/dashboard/page.js`.
