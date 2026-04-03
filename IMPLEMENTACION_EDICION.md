# 🚀 EVOLUCIÓN DE LA PLATAFORMA EDUCATIVA

## Resumen de Cambios

Se ha profesionalizado la estructura de la plataforma para soportar:
- ✅ Múltiples autores con vinculación real a `auth.users`
- ✅ Categorías fijas en tabla dedicada
- ✅ Foreign keys proper entre tablas
- ✅ Sistema de edición de artículos
- ✅ Validación de propiedad (solo el autor puede editar)

---

## 📁 Archivos Creados/Modificados

### Nuevos Archivos:
| Archivo | Descripción |
|---------|-------------|
| `supabase-schema-evolution.sql` | Script SQL para evolución de BD |
| `app/dashboard/editar/[id]/page.js` | Página de edición de artículos |

### Archivos Modificados:
| Archivo | Cambios |
|---------|---------|
| `lib/blog.js` | Funciones para categorías, edición con validación de autor |
| `app/dashboard/page.js` | Selector de categorías dinámico, botón Editar |

---

## 🔧 PASOS DE INSTALACIÓN

### PASO 1: Ejecutar Script SQL en Supabase

1. Ve a https://supabase.com
2. Entra a tu proyecto: `jetjlftghxhzrbmlzjeh`
3. Ve a **SQL Editor** (menú izquierdo)
4. Copia y pega el contenido de `supabase-schema-evolution.sql`
5. **Ejecuta el script completo**

Este script:
- Crea la tabla `categorias` con las 4 categorías obligatorias
- Agrega `categoria_id` (FK a categorias) a la tabla `articulos`
- Agrega `autor_id` (FK a auth.users) para validación de propietario
- Configura políticas RLS para seguridad
- Crea índices para rendimiento
- Agrega trigger para `updated_at`

### PASO 2: Verificar la Estructura

En Supabase, ve a **Table Editor** y verifica:

**Tabla `categorias`:**
| Columna | Tipo |
|---------|------|
| id | uuid (PK) |
| nombre | text |
| slug | text |
| created_at | timestamp |
| descripcion | text |

**Tabla `articulos` (columnas nuevas):**
| Columna | Tipo |
|---------|------|
| categoria_id | uuid (FK → categorias.id) |
| autor_id | uuid (FK → auth.users.id) |
| updated_at | timestamp |

---

## 📝 FUNCIONALIDADES IMPLEMENTADAS

### 1. Selector de Categorías Dinámico

El formulario del dashboard ahora consume las categorías de la base de datos:

```javascript
// Las categorías se cargan automáticamente
const { data } = await obtenerCategorias()
// Recursos Educativos, Formación Docente, Cursos, Tecnología Educativa
```

### 2. Edición de Artículos

**Ruta:** `/dashboard/editar/[id]`

Características:
- ✅ Carga datos existentes del artículo
- ✅ Valida que el usuario sea el autor
- ✅ Actualiza todos los campos incluyendo categoría
- ✅ Redirige al dashboard tras guardar exitosamente

### 3. Validación de Autor

Solo el autor puede editar/eliminar sus artículos:

```javascript
// En guardarArticulo()
if (existingArticle.autor_id !== usuarioAuth.id) {
  return { error: { message: 'No tienes permisos...' } }
}
```

### 4. Vinculación Autor-Artículo

Los nuevos artículos automáticamente vinculan al usuario autenticado:

```javascript
const payload = {
  // ... otros campos
  autor_id: usuarioAuth.id,  // ← Vinculación real
  autor: usuarioAuth.email   // ← Nombre visible (compatibilidad)
}
```

---

## 🗂️ ESTRUCTURA DE DATOS ACTUALIZADA

### Tabla: `categorias`

```
id (UUID, PK)
nombre (TEXT, UNIQUE)     ← "Recursos Educativos", "Formación Docente", etc.
slug (TEXT, UNIQUE)       ← "recursos-educativos", "formacion-docente", etc.
created_at (TIMESTAMP)
descripcion (TEXT)
```

### Tabla: `articulos`

```
id (UUID, PK)
titulo (TEXT)
contenido (TEXT)
resumen (TEXT)
etiqueta (TEXT)           ← Mantenida para compatibilidad
categoria_id (UUID, FK)   ← Nueva: referencia a categorias.id
autor (TEXT)              ← Mantenida para nombre visible
autor_id (UUID, FK)       ← Nueva: referencia a auth.users.id
imagen_url (TEXT)
publicado (BOOLEAN)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)    ← Nueva: se actualiza automáticamente
```

---

## 🔒 SEGURIDAD (RLS Policies)

### Políticas para `articulos`:

| Acción | Condición |
|--------|-----------|
| SELECT (público) | `publicado = true` |
| SELECT (auth) | Todos los artículos |
| INSERT | `auth.uid() = autor_id` |
| UPDATE | `auth.uid() = autor_id` |
| DELETE | `auth.uid() = autor_id` |

### Políticas para `categorias`:

| Acción | Condición |
|--------|-----------|
| SELECT | Todos (público) |
| INSERT/UPDATE/DELETE | Usuarios autenticados |

---

## 🧪 PRUEBAS RECOMENDADAS

### 1. Crear Artículo
1. Inicia sesión en `/login`
2. Ve a `/dashboard`
3. Llena el formulario seleccionando una categoría
4. Verifica en consola que se guarda `categoria_id` y `autor_id`

### 2. Editar Artículo
1. En el dashboard, haz clic en "✏️ Editar" de un artículo
2. Modifica algunos campos
3. Guarda y verifica la redirección
4. Intenta editar un artículo de otro usuario (debe fallar)

### 3. Validación de Autor
```sql
-- En SQL Editor de Supabase, verifica:
SELECT id, titulo, autor, autor_id, categoria_id 
FROM articulos 
LIMIT 5;
```

---

## 📚 FUNCIONES DISPONIBLES EN `lib/blog.js`

### Categorías:
- `obtenerCategorias()` - Lista todas las categorías
- `obtenerCategoriaPorSlug(slug)` - Obtiene categoría por slug

### Artículos:
- `obtenerArticulos(soloPublicados)` - Con datos de categoría
- `obtenerArticuloPorId(id)` - Con validación de categoría
- `obtenerArticulosPorAutor(autorId)` - Filtra por autor
- `obtenerArticulosPorCategoria(categoriaId)` - Filtra por categoría
- `guardarArticulo(articulo, usuarioAuth)` - Crea/Actualiza con validación
- `actualizarArticulo(id, actualizaciones, usuarioAuth)` - Solo update
- `eliminarArticulo(id, usuarioAuth)` - Con validación de autor
- `togglearPublicacion(id, publicado, usuarioAuth)` - Cambia estado

### Utilidades:
- `obtenerEstadisticasArticulos(autorId)` - Stats opcionalmente por autor
- `formatearFecha(fecha)` - Formato legible
- `formatearFechaCompleta(fecha)` - Con hora

---

## ⚠️ NOTAS IMPORTANTES

1. **Compatibilidad:** La columna `etiqueta` se mantiene para no romper registros antiguos
2. **Migración:** Los artículos existentes pueden tener `categoria_id` NULL
3. **Autor:** Para artículos antiguos, `autor_id` puede ser NULL
4. **Nuevo comportamiento:** Los artículos nuevos SIEMPRE deben tener `autor_id`

### Migrar artículos antiguos (opcional):

```sql
-- Vincular etiqueta existente con categoria_id
UPDATE articulos a
SET categoria_id = c.id
FROM categorias c
WHERE LOWER(a.etiqueta) = LOWER(c.nombre)
  AND a.categoria_id IS NULL;
```

---

## 🛠️ COMANDOS ÚTILES

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Limpiar caché
rm -rf .next && npm run dev
```

---

## 📋 CHECKLIST DE VERIFICACIÓN

- [ ] Script SQL ejecutado en Supabase
- [ ] Tabla `categorias` existe con 4 registros
- [ ] Columnas `categoria_id` y `autor_id` agregadas a `articulos`
- [ ] Políticas RLS configuradas
- [ ] Build exitoso (`npm run build`)
- [ ] Crear artículo funciona
- [ ] Editar artículo funciona
- [ ] Validación de autor funciona
- [ ] Selector de categorías muestra datos de BD

---

## 🆘 SOPORTE

Si encuentras errores:

1. **Revisa la consola del navegador** - Busca mensajes de error
2. **Verifica RLS en Supabase** - Las políticas deben estar activas
3. **Confirma la estructura de tablas** - Debe coincidir con el schema
4. **Reinicia el servidor** - Después de cambios en `.env.local`
