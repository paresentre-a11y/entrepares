const sharp  = require('sharp')
const fs     = require('fs')
const path   = require('path')

const carpeta = path.join(process.cwd(), 'public/images')

async function optimizar() {
  const archivos = fs.readdirSync(carpeta).filter(f =>
    /\.(jpg|jpeg|png)$/i.test(f) && f !== 'logo.png' && !f.startsWith('yo_en')
  )

  console.log(`Optimizando ${archivos.length} imágenes...`)

  for (const archivo of archivos) {
    const rutaEntrada = path.join(carpeta, archivo)
    const nombreSin   = path.parse(archivo).name
    const rutaSalida  = path.join(carpeta, `${nombreSin}.webp`)

    const infoAntes = fs.statSync(rutaEntrada)

    await sharp(rutaEntrada)
      .resize(1200, null, {
        withoutEnlargement: true,
        fit: 'inside',
      })
      .webp({ quality: 82 })
      .toFile(rutaSalida)

    const infoDespues = fs.statSync(rutaSalida)
    const reduccion   = (
      (1 - infoDespues.size / infoAntes.size) * 100
    ).toFixed(0)

    console.log(
      `✅ ${archivo} → ${nombreSin}.webp ` +
      `(${reduccion}% más liviano)`
    )
  }

  console.log('\n🎉 Optimización completada.')
  console.log('Puedes borrar los JPG originales si quieres.')
}

optimizar().catch(console.error)
