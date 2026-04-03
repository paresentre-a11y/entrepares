import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Entre Pares Chiriquí — MEDUCA',
  description: 'Formando docentes para la educación del siglo XXI',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="font-body text-ep-texto bg-white">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
