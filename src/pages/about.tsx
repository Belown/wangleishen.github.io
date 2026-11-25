import { ABOUT_NAME } from '../content'
import { Profile } from './home'
import { useTitle } from './shared'

export function About() {
  useTitle((ABOUT_NAME))
  return (
    <main className="about">
      <Profile page />
    </main>
  )
}
