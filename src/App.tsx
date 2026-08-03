import Navbar from '@/components/custom/Navbar'
import Hero from '@/components/custom/Hero'
import FeaturedProject from '@/components/custom/FeaturedProject'
import Projects from '@/components/custom/Projects'
import Publications from '@/components/custom/Publications'
import Background from '@/components/custom/Background'
import Contact from '@/components/custom/Contact'
import Footer from '@/components/custom/Footer'

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <FeaturedProject />
      <Projects />
      <Publications />
      <Background />
      <Contact />
      <Footer />
    </div>
  )
}

export default App
