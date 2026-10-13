import Desktop from '@/portfolio/Desktop'
import Mobile from '@/portfolio/Mobile'
import { useMediaQuery } from '@/portfolio/hooks'

// Two separately designed layouts (Claude Design: Portfolio / Portfolio Mobile).
function App() {
  const mobile = useMediaQuery('(max-width: 767px)')
  return mobile ? <Mobile /> : <Desktop />
}

export default App
