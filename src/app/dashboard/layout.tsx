// Dashboard has its own header — suppress the global Navbar and Footer
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
