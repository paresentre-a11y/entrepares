const sharp = require('sharp')
const fs    = require('fs')
const path  = require('path')

const carpeta = path.join(process.cwd(), 'public/images')

async function optimizar() {
  const archivos = fs.readdirSync(carpeta).filter(f =>
    /\.(jpg|jpeg|png)$/i.test(f)
  )

  console.log(`Optimizando ${archivos.length} imágenes...`)
  let corregidas = 0

  for (const archivo of archivos) {
    const rutaEntrada = path.join(carpeta, archivo)
    const nombreSin   = path.parse(archivo).name
    const rutaSalida  = path.join(carpeta, `${nombreSin}.webp`)

    try {
      const infoAntes = fs.statSync(rutaEntrada)

      // Leer metadatos EXIF para detectar orientación
      const metadata = await sharp(rutaEntrada).metadata()
      const orientacion = metadata.orientation || 1

      let pipeline = sharp(rutaEntrada)

      // Corregir orientación automáticamente con EXIF
      // rotate() sin parámetros usa los metadatos EXIF
      pipeline = pipeline.rotate()

      // Redimensionar manteniendo proporción original
      pipeline = pipeline.resize(1200, null, {
        withoutEnlargement: true,
        fit: 'inside',
      })

      // Convertir a WebP con buena calidad
      await pipeline
        .webp({ quality: 82 })
        .toFile(rutaSalida)

      const infoDespues = fs.statSync(rutaSalida)
      const reduccion   = (
        (1 - infoDespues.size / infoAntes.size) * 100
      ).toFixed(0)

      if (orientacion !== 1) {
        corregidas++
        console.log(
          `✅ ${archivo} → ${nombreSin}.webp ` +
          `(${reduccion}% más liviano) 🔄 orientación corregida`
        )
      } else {
        console.log(
          `✅ ${archivo} → ${nombreSin}.webp ` +
          `(${reduccion}% más liviano)`
        )
      }

    } catch (err) {
      console.error(`❌ Error en ${archivo}:`, err.message)
    }
  }

  console.log(`\n🎉 Completado.`)
  console.log(`🔄 ${corregidas} fotos con orientación corregida.`)
  console.log(`\nAhora ejecuta: ls public/images/*.webp`)
}

optimizar().catch(console.error)
