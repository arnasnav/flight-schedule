import type { Metadata } from "next"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import type { ReactNode } from "react"
import { StoreProvider } from "@/components/providers/store-provider"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "Lėktuvų tvarkaraštis",
  description: "Lėktuvų tvarkaraštis",
}

type IProps = {
  children: ReactNode
}

export default function RootLayout({ children }: IProps) {
  return (
    <html lang="lt">
      <body className="min-h-screen bg-background">
        <StoreProvider>
          <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4">
            <Header />

            <main className="flex-1">{children}</main>

            <Footer />
          </div>

          <Toaster position="bottom-right" richColors closeButton />
        </StoreProvider>
      </body>
    </html>
  )
}
