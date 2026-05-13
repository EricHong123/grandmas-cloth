import { Outlet } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Header from './Header'
import Footer from './Footer'
import WhatsAppButton from './WhatsAppButton'
import { orgSchema } from '../common/JsonLd'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(orgSchema)}
        </script>
      </Helmet>
      <Header />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
