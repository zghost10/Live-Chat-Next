import { Montserrat } from 'next/font/google'
import './globals.css'

const font = Montserrat({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
      <body className={`${font.className} flex flex-col h-[100svh] w-full p-4`}>
        {children}
      </body>
    </html>
  )
}
