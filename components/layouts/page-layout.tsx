import { ReactNode } from "react"
import { Footer } from "@/components/ui/footer"

interface PageLayoutProps {
  children: ReactNode
  customFooter?: ReactNode
  className?: string
}

export function PageLayout({ children, customFooter, className = "" }: PageLayoutProps) {
  return (
    <>
      <main className={`mx-auto w-full lg:w-[90%] px-6 py-10 ${className}`}>
        {children}
      </main>
      
      {customFooter ? customFooter : <Footer />}
    </>
  )
}