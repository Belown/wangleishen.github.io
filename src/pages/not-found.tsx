import { Link } from 'react-router'
import { lead, useTitle } from './shared'

export function NotFound() {
  useTitle('Not found')
  return (
    <main className="missing">
      <h1 className="display keep" style={lead('Nothing here')}>{'Nothing here'}</h1>
      <p className="line">{'The page you are looking for is not on this site.'}</p>
      <p><Link to="/" className="text-link">{'Back to the start'}</Link></p>
    </main>
  )
}
