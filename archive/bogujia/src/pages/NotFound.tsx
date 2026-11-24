import { Link, useLocation } from 'react-router'
import { Crumb, Foot, Kick } from '../components/bits'

export default function NotFound() {
  const { pathname } = useLocation()
  return (
    <>
      <Crumb trail={[[null, 'lost']]} />
      <Kick>404</Kick>
      <h1 className="pt" tabIndex={-1}>This path isn't raked yet.</h1>
      <p className="lede">
        There is nothing at <span className="mono small">{pathname}</span>. Go back to the <Link to="/">garden</Link> or look through the <Link to="/works">works</Link>.
      </p>
      <Foot />
    </>
  )
}
