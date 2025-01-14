import type { Metadata } from "next"
import { ToastContainer } from "react-toastify"
import "./globals.css"

import type React from "react"

export const metadata: Metadata = {
  title: "Arcana AI",
  description: "Arcana is the first Artificial Intelligence focused on games, ask her anything about games :)",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    images: "/arcana-banner.png",
    title: "Arcana AI",
    description: "Arcana is the first Artificial Intelligence focused on games, ask her anything about games :)",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body
        className="antialiased relative min-h-svh   px-4 bg-[url('/bg-arcana.png')] bg-fixed bg-center bg-no-repeat bg-cover"
        cz-shortcut-listen="true"
      >
        {children}

        <ToastContainer />
      </body>
    </html>
  )
}
