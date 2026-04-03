# ✅ CORRECCIONES REALIZADAS - SUPABASE DASHBOARD

## Problemas Identificados y Corregidos

### 1. `.env.local` no existía
**SOLUCIÓN:** Se creó el archivo `.env.local` con las credenciales de Supabase.

### 2. `lib/supabase.js` tenía credenciales hardcodeadas
**SOLUCIÓN:** Ahora usa `process.env.NEXT_PUBLIC_SUPABASE_URL` y `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. `lib/blog.js` y `lib/auth.js` tenían `'use client'` innecesario
**SOLUCIÓN:** Se removió `'use client'` - estos archivos son módulos utilitarios, no componentes React.

### 4. Falta de logging para debug
**SOLUCIÓN:** Se agregaron console.log detallados en `guardarArticulo()` para rastrear el flujo de datos.

### 5. Posible problema de RLS (Row Level Security)
**SOLUCIÓN:** Se creó `supabase-rls-setup.sql` con las políticas necesarias.

---

## 🚨 PASOS CRÍTICOS QUE DEBES SEGUIR

### PASO 1: Configurar RLS en Supabase (MUY IMPORTANTE)

1. Ve a https://supabase.com
2. Entra a tu proyecto: `jetjlftghxhzrbmlzjeh`
3. Ve a **SQL Editor** (en el menú izquierdo)
4. Copia y pega el contenido de `supabase-rls-setup.sql`
5. Ejecuta el script

Esto creará las políticas para permitir INSERT, UPDATE, SELECT, DELETE.

### PASO 2: Verificar estructura de la tabla

En Supabase, ve a **Table Editor** y verifica que la tabla `articulos` tenga:

| Columna     | Tipo      |
|-------------|-----------|
| id          | uuid (PK) |
| titulo      | text      |
| contenido   | text      |
| resumen     | text      |
| etiqueta    | text      |
| autor       | text      |
| imagen_url  | text      |
| publicado   | boolean   |
| created_at  | timestamp |

### PASO 3: Probar el guardado

1. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Ve a http://localhost:3000/login e inicia sesión

3. Ve a http://localhost:3000/dashboard

4. Abre la consola del navegador (F12)

5. Llena el formulario y haz clic en "Guardar Artículo"

6. **Verifica en consola:**
   - 🔵 `Intentando guardar artículo:` - Debe mostrar los datos
   - 📝 `Insertando nuevo artículo`
   - 📦 `Payload:` - Verifica que los datos no estén vacíos
   - ✅ `Artículo guardado:` - Si funciona, verás los datos guardados
   - ❌ Si hay error, verás el mensaje de error

---

## Archivos Modificados

| Archivo                    | Cambio                                    |
|----------------------------|-------------------------------------------|
| `.env.local`               | CREADO - Variables de entorno             |
| `lib/supabase.js`          | Ahora usa process.env                     |
| `lib/supabaseClient.js`    | CREADO - Alias compatible                 |
| `lib/blog.js`              | Debug logging + sin 'use client'          |
| `lib/auth.js`              | Sin 'use client'                          |
| `supabase-rls-setup.sql`   | CREADO - Script para políticas RLS        |

---

## Debugging

Si el guardado FALLA, revisa:

1. **Consola del navegador** - Busca el error específico
2. **RLS policies** - Ejecuta el script SQL en Supabase
3. **Columnas de la tabla** - Verifica que coincidan con el payload
4. **Variables de entorno** - Reinicia el servidor después de crear .env.local

---

## Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build (verificar errores)
npm run build

# Limpiar caché de Next.js
rm -rf .next && npm run dev
```
