import { Link, useParams } from 'react-router'
import { CV, OWNER, PEOPLE, SECTIONS, WORKS, whenOf, workBySlug } from './content'
import { Bi, useLang } from './i18n'
import { Blocks, Img } from './media'
import { Fill, Links, NewsList, Tx, useTitle } from './ui'

export function WorkPage() {
  const { slug } = useParams()
  const w = workBySlug(slug)
  const { t, tr, pri } = useLang()
  useTitle(w ? pri(w.title) : null)
  if (!w) return <NotFound />
  const i = WORKS.indexOf(w)
  const prev = WORKS[i - 1]
  const next = WORKS[i + 1]
  const facts: [string, string | undefined][] = [
    [tr('时间', 'Date'), whenOf(w)],
    [tr('发表', 'Venue'), w.venue],
    [tr('作者', 'Authors'), w.authors],
    [tr('角色', 'Role'), w.role && t(w.role)],
    [tr('工具', 'Tools'), w.tools && t(w.tools)],
  ]
  return (
    <main className="page work-page">
      <header className="wrap page-head">
        <Link to="/#work" className="back">← {tr('全部作品', 'All work')}</Link>
        <p className="eyebrow">{w.sec.map((k) => t(SECTIONS[k].name)).join(' · ')}</p>
        <h1 className="title"><Bi text={w.title} /></h1>
        <p className="lede"><Tx text={w.summary} /></p>
        <dl className="facts">
          {facts.filter(([, v]) => v).map(([k, v]) => (
            <div key={k}><dt>{k}</dt><dd><Fill text={v!} /></dd></div>
          ))}
        </dl>
      </header>
      <div className="wrap cover"><Img file={`works/${w.slug}/cover.jpg`} ratio="16/9" /></div>
      <article className="wrap prose"><Blocks blocks={w.body} /></article>
      <nav className="wrap pager" aria-label={tr('更多作品', 'More work')}>
        {prev ? <Link to={`/work/${prev.slug}`} rel="prev"><small>{tr('上一个', 'Previous')}</small>{t(prev.title)}</Link> : <span />}
        {next && <Link to={`/work/${next.slug}`} rel="next" className="next"><small>{tr('下一个', 'Next')}</small>{t(next.title)}</Link>}
      </nav>
    </main>
  )
}

export function About() {
  const { t, tr } = useLang()
  useTitle(tr('关于', 'About'))
  const pubs = WORKS.filter((w) => w.venue)
  return (
    <main className="page">
      <div className="wrap">
        <section className="about about-page">
          <div>
            <h1 className="title">{OWNER.name}{OWNER.nameZh && <span className="zh"> {OWNER.nameZh}</span>}</h1>
            <p className="lede"><Tx text={OWNER.lede} /></p>
            {OWNER.about.map((p) => <p key={p.en}><Tx text={p} /></p>)}
            <Links />
          </div>
          <Img file={OWNER.portrait} ratio="3/4" cap={OWNER.portraitCap} alt={OWNER.name} />
        </section>

        <section className="split" id="cv">
          <h2>{tr('教育与经历', 'Education')}</h2>
          <ol className="rows">
            {CV.map((c) => (
              <li key={c.when}><span className="when">{c.when}</span><span><b><Tx text={c.title} /></b><small><Tx text={c.org} /></small></span></li>
            ))}
          </ol>
        </section>

        <section className="split" id="publications">
          <h2>{tr('论文', 'Publications')}</h2>
          <ol className="rows">
            {pubs.map((w) => (
              <li key={w.slug}>
                <span className="when">{w.venue}</span>
                <span>
                  <Link to={`/work/${w.slug}`}><b><Bi text={w.title} /></b></Link>
                  <span className="sum"><Tx text={w.summary} /></span>
                  {w.authors && <small><Fill text={w.authors} /></small>}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section className="split" id="news">
          <h2>{tr('动态', 'News')}</h2>
          <NewsList />
        </section>

        <section className="split" id="people">
          <h2>{tr('合作者', 'Collaborators')}</h2>
          <ul className="people">
            {PEOPLE.map((p, i) => (
              <li key={i}><a href={p.href}><Fill text={p.name} /></a><small><Tx text={p.role} /><br /><Fill text={p.org} /></small></li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}

export function NotFound() {
  const { tr } = useLang()
  useTitle(tr('找不到页面', 'Not found'))
  return (
    <main className="page wrap page-head">
      <h1 className="title">404</h1>
      <p className="lede">{tr('这个页面不存在。', 'This page does not exist.')}</p>
      <Link to="/" className="back">← {tr('回到首页', 'Back home')}</Link>
    </main>
  )
}
