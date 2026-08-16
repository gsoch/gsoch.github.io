import Navbar from '@/components/custom/Navbar'
import Hero from '@/components/custom/Hero'
import FeaturedProject from '@/components/custom/FeaturedProject'
import Projects from '@/components/custom/Projects'
import Publications from '@/components/custom/Publications'
import Contact from '@/components/custom/Contact'
import Footer from '@/components/custom/Footer'
import BitTrail from '@/components/custom/BitTrail'

function App() {
  return (
    <div className="min-h-screen bg-blueprint">
      <BitTrail />
      <Navbar />
      <Hero />
      <FeaturedProject />
      <Projects />
      <Publications />
      <Contact />
      <Footer />
    </div>
  )
}

export default App
