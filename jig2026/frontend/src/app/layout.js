import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
}