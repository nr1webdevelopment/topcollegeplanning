'use client'
import { posts } from '@/lib/content'
import PostCard from '@/components/PostCard'
import Link from 'next/link'
import { lawSchools } from '@/data/law-schools-data'
import { useLanguage } from '@/lib/i18n'

// ── CURRENT SUPREME COURT JUSTICES ───────────────────────────────────────────
const scotusJustices = [
  {
    name: 'John G. Roberts Jr.',
    title: 'Chief Justice',
    since: 2005,
    appointedBy: 'George W. Bush',
    lawSchool: 'Harvard Law School',
    lawSchoolSlug: 'harvard-law',
    schoolColor: '#A51C30',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Official_roberts_CJ.jpg/400px-Official_roberts_CJ.jpg',
    notes: 'Focuses on institutional legitimacy of the Court; frequent swing vote in major decisions.',
  },
  {
    name: 'Clarence Thomas',
    title: 'Associate Justice',
    since: 1991,
    appointedBy: 'George H.W. Bush',
    lawSchool: 'Yale Law School',
    lawSchoolSlug: 'yale-law',
    schoolColor: '#00356B',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Clarence_Thomas_official_SCOTUS_portrait_%283x4_cropped%29.jpg/400px-Clarence_Thomas_official_SCOTUS_portrait_%283x4_cropped%29.jpg',
    notes: 'Longest-serving current Justice. Strict originalist; known for writing solo concurrences.',
  },
  {
    name: 'Samuel A. Alito Jr.',
    title: 'Associate Justice',
    since: 2006,
    appointedBy: 'George W. Bush',
    lawSchool: 'Yale Law School',
    lawSchoolSlug: 'yale-law',
    schoolColor: '#00356B',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Samuel_Alito_official_photo.jpg/400px-Samuel_Alito_official_photo.jpg',
    notes: 'Authored the majority opinion in Dobbs v. Jackson Women\'s Health Organization (2022).',
  },
  {
    name: 'Sonia Sotomayor',
    title: 'Associate Justice',
    since: 2009,
    appointedBy: 'Barack Obama',
    lawSchool: 'Yale Law School',
    lawSchoolSlug: 'yale-law',
    schoolColor: '#00356B',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Sonia_Sotomayor_in_SCOTUS_robe.jpg/400px-Sonia_Sotomayor_in_SCOTUS_robe.jpg',
    notes: 'First Latina Supreme Court Justice. Grew up in the South Bronx; advocates for lived-experience in jurisprudence.',
  },
  {
    name: 'Elena Kagan',
    title: 'Associate Justice',
    since: 2010,
    appointedBy: 'Barack Obama',
    lawSchool: 'Harvard Law School',
    lawSchoolSlug: 'harvard-law',
    schoolColor: '#A51C30',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Elena_Kagan_Official_SCOTUS_Portrait_%282013%29.jpg/400px-Elena_Kagan_Official_SCOTUS_Portrait_%282013%29.jpg',
    notes: 'Former Dean of Harvard Law School and first female Solicitor General of the United States.',
  },
  {
    name: 'Neil M. Gorsuch',
    title: 'Associate Justice',
    since: 2017,
    appointedBy: 'Donald Trump',
    lawSchool: 'Harvard Law School',
    lawSchoolSlug: 'harvard-law',
    schoolColor: '#A51C30',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Associate_Justice_Neil_Gorsuch_Official_Portrait.jpg/400px-Associate_Justice_Neil_Gorsuch_Official_Portrait.jpg',
    notes: 'Textualist and originalist. Oxford Marshall Scholar; former 10th Circuit Court of Appeals judge.',
  },
  {
    name: 'Brett M. Kavanaugh',
    title: 'Associate Justice',
    since: 2018,
    appointedBy: 'Donald Trump',
    lawSchool: 'Yale Law School',
    lawSchoolSlug: 'yale-law',
    schoolColor: '#00356B',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Associate_Justice_Brett_Kavanaugh_Official_Portrait_%28full_length%29.jpg/400px-Associate_Justice_Brett_Kavanaugh_Official_Portrait_%28full_length%29.jpg',
    notes: 'Former D.C. Circuit judge. Clerked for Justice Anthony Kennedy before his own confirmation.',
  },
  {
    name: 'Amy Coney Barrett',
    title: 'Associate Justice',
    since: 2020,
    appointedBy: 'Donald Trump',
    lawSchool: 'Notre Dame Law School',
    lawSchoolSlug: null,
    schoolColor: '#0C2340',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Official_Amy_Barrett_photo.jpg/400px-Official_Amy_Barrett_photo.jpg',
    notes: 'Former Notre Dame Law professor. Clerked for Justice Antonin Scalia. See her profile under Midwest\'s Best → Notre Dame.',
  },
  {
    name: 'Ketanji Brown Jackson',
    title: 'Associate Justice',
    since: 2022,
    appointedBy: 'Joe Biden',
    lawSchool: 'Harvard Law School',
    lawSchoolSlug: 'harvard-law',
    schoolColor: '#A51C30',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Ketanji_Brown_Jackson_official_SCOTUS_portrait.jpg/400px-Ketanji_Brown_Jackson_official_SCOTUS_portrait.jpg',
    notes: 'First Black woman to serve on the Supreme Court. Former federal public defender and D.C. Circuit judge.',
  },
]

export default function TopLawSchoolsPage() {
  const { t } = useLanguage()
  const ndLawPost = posts.find(p => p.slug === 'u-s-senate-confirms-nd-law-school-alum-edward-s-kiel-as-federal-judge')

  return (
    <div className="bg-white min-h-screen">
      <div className="relative text-white py-20 overflow-hidden">
        {/* Background photo — University of Southern California */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=1800&q=80"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Navy overlay */}
        <div className="absolute inset-0 bg-navy opacity-80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-brand-orange font-bold uppercase tracking-widest text-sm mb-3">{t('Legal Education', '法学教育', 'Educación Legal')}</p>
          <h1 className="text-4xl md:text-6xl font-black mb-5 leading-tight">{t('Top Law Schools', '顶尖法学院', 'Mejores Escuelas de Derecho')}</h1>
          <p className="text-gray-300 text-lg max-w-2xl leading-relaxed mb-8">
            {t(
              'From Yale to Georgetown — explore LSAT medians, bar passage rates, BigLaw placement, and what it takes to get accepted at America\'s best law schools.',
              '从耶鲁到乔治城——探索LSAT中位数、律师资格考试通过率、大所录用率以及进入美国顶尖法学院的必备条件。',
              'De Yale a Georgetown — explora medianas del LSAT, tasas de aprobación del examen de abogacía y lo que se necesita para ingresar a las mejores escuelas de derecho de EE.UU.'
            )}
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#schools" className="btn-primary">
              {t('View Top 10 Schools', '查看十强法学院', 'Ver Top 10 Escuelas')}
            </a>
            <Link href="/top-law-schools/cost-calculator" className="btn-outline border-white text-white hover:bg-white hover:text-navy">
              {t('Cost Calculator', '费用计算器', 'Calculadora de Costos')}
            </Link>
          </div>
        </div>
      </div>

      <div id="schools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="section-title mb-8">{t('Top 10 Law Schools (US News)', '美国新闻顶尖10所法学院', 'Top 10 Escuelas de Derecho (US News)')}</h2>
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse bg-white shadow-sm">
            <thead>
              <tr className="bg-navy text-white">
                <th className="py-4 px-4 text-left font-bold w-10">#</th>
                <th className="py-4 px-4 text-left font-bold">{t('School', '学校', 'Escuela')}</th>
                <th className="py-4 px-4 text-center font-bold hidden sm:table-cell">LSAT</th>
                <th className="py-4 px-4 text-center font-bold hidden md:table-cell">GPA</th>
                <th className="py-4 px-4 text-center font-bold hidden md:table-cell">BigLaw</th>
                <th className="py-4 px-4 text-center font-bold hidden lg:table-cell">{t('Bar Pass', '律考通过率', 'Aprob. Barra')}</th>
                <th className="py-4 px-4 text-center font-bold">{t('Accept %', '录取率', 'Admisión %')}</th>
                <th className="py-4 px-4 text-left font-bold"></th>
              </tr>
            </thead>
            <tbody>
              {lawSchools.map((school, i) => (
                <tr key={school.slug} className={`border-b border-gray-100 hover:bg-orange-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="py-4 px-4 font-black text-brand-orange text-lg">{school.usNewsRanking}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex-shrink-0 rounded-full bg-white border border-gray-200 flex items-center justify-center p-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={school.logoUrl} alt={school.shortName} className="w-full h-full object-contain" />
                      </div>
                      <Link href={`/top-law-schools/${school.slug}`} className="font-bold text-navy hover:text-brand-orange transition-colors">{school.name}</Link>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-navy hidden sm:table-cell">{school.lsatMedian}</td>
                  <td className="py-4 px-4 text-center text-gray-600 text-sm hidden md:table-cell">{school.gpaMedian.toFixed(2)}</td>
                  <td className="py-4 px-4 text-center hidden md:table-cell"><span className="font-bold" style={{ color: school.color }}>{school.bigLawPlacement}</span></td>
                  <td className="py-4 px-4 text-center text-green-600 font-semibold hidden lg:table-cell">{school.barPassRate}</td>
                  <td className="py-4 px-4 text-center text-gray-500 text-sm">{school.acceptanceRate}</td>
                  <td className="py-4 px-4"><Link href={`/top-law-schools/${school.slug}`} className="text-brand-orange text-sm font-bold hover:underline whitespace-nowrap">{t('View →', '查看 →', 'Ver →')}</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {lawSchools.map(school => (
            <Link key={school.slug} href={`/top-law-schools/${school.slug}`}
              className="group bg-gray-soft border-l-4 hover:shadow-md transition-all block" style={{ borderColor: school.color }}>
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm p-1.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={school.logoUrl} alt={school.shortName} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: school.color }}>US News #{school.usNewsRanking}</p>
                    <h3 className="font-bold text-navy text-lg group-hover:text-brand-orange transition-colors leading-tight">{school.name}</h3>
                    <p className="text-sm text-gray-500">{school.location.city}, {school.location.state}</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div><p className="text-xs text-gray-400 uppercase tracking-wide">LSAT</p><p className="font-black text-navy">{school.lsatMedian}</p></div>
                  <div><p className="text-xs text-gray-400 uppercase tracking-wide">BigLaw</p><p className="font-black" style={{ color: school.color }}>{school.bigLawPlacement}</p></div>
                  <div><p className="text-xs text-gray-400 uppercase tracking-wide">{t('Bar Pass', '律考', 'Barra')}</p><p className="font-black text-green-600">{school.barPassRate}</p></div>
                  <div><p className="text-xs text-gray-400 uppercase tracking-wide">{t('Accept', '录取率', 'Admisión')}</p><p className="font-black text-navy">{school.acceptanceRate}</p></div>
                </div>
                <div className="mt-3 text-right"><span className="text-xs font-bold text-brand-orange uppercase tracking-wider group-hover:underline">{t('Full Profile →', '完整资料 →', 'Perfil Completo →')}</span></div>
              </div>
            </Link>
          ))}
        </div>

        {/* ── CURRENT SUPREME COURT ───────────────────────────── */}
        <div className="mb-16">
          <div className="flex items-end gap-4 mb-2">
            <h2 className="section-title mb-0">{t('Current Supreme Court of the United States', '现任美国最高法院大法官', 'Actual Corte Suprema de EE.UU.')}</h2>
            <span className="text-xs font-bold bg-navy text-white px-2 py-1 mb-1">9 JUSTICES</span>
          </div>
          <p className="text-gray-500 mb-8">
            {t(
              '8 of 9 current justices attended a Top 10 law school. Yale and Harvard dominate — together producing 8 of the 9 sitting justices.',
              '9位现任大法官中，有8位毕业于全美前10法学院。耶鲁和哈佛占据主导地位，共培养了8位现任大法官。',
              '8 de los 9 magistrados actuales asistieron a una escuela de derecho del Top 10. Yale y Harvard dominan — juntas formaron a 8 de los 9 magistrados en funciones.'
            )}
          </p>

          {/* School breakdown bar */}
          <div className="flex flex-wrap gap-3 mb-8">
            {[
              { school: 'Yale Law', count: 4, color: '#00356B' },
              { school: 'Harvard Law', count: 4, color: '#A51C30' },
              { school: 'Notre Dame Law', count: 1, color: '#0C2340' },
            ].map(s => (
              <div key={s.school} className="flex items-center gap-2 bg-gray-soft px-4 py-2 rounded-full">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                <span className="text-sm font-bold text-navy">{s.school}</span>
                <span className="text-sm font-black" style={{ color: s.color }}>{s.count}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {scotusJustices.map((justice) => (
              <div key={justice.name} className="bg-gray-soft overflow-hidden border-t-4 hover:shadow-md transition-all" style={{ borderColor: justice.schoolColor }}>
                {/* Portrait */}
                <div className="h-52 overflow-hidden bg-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={justice.photo}
                    alt={justice.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                {/* Info */}
                <div className="p-4">
                  <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: justice.schoolColor }}>
                    {justice.title === 'Chief Justice' ? '⬡ Chief Justice' : 'Associate Justice'}
                  </p>
                  <h3 className="font-black text-navy text-sm leading-tight mb-2">{justice.name}</h3>
                  <div className="space-y-1 mb-3">
                    {justice.lawSchoolSlug ? (
                      <Link href={`/top-law-schools/${justice.lawSchoolSlug}`}
                        className="inline-block text-xs font-bold px-2 py-0.5 text-white hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: justice.schoolColor }}>
                        {justice.lawSchool}
                      </Link>
                    ) : (
                      <span className="inline-block text-xs font-bold px-2 py-0.5 text-white" style={{ backgroundColor: justice.schoolColor }}>
                        {justice.lawSchool}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mb-1">
                    <span className="font-semibold text-navy">Since {justice.since}</span>
                  </p>
                  <p className="text-xs text-gray-400 mb-2">Appointed by {justice.appointedBy}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{justice.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notable Graduates */}
        <div className="mb-16">
          <h2 className="section-title mb-2">{t('Notable Law School Graduates', '知名法学院校友', 'Egresados Destacados de Escuelas de Derecho')}</h2>
          <p className="text-gray-500 mb-8">{t('Supreme Court Justices, U.S. Presidents, and landmark legal figures who studied at these elite law schools.', '曾就读于这些顶尖法学院的最高法院大法官、美国总统及重要法律人物。', 'Magistrados de la Corte Suprema, Presidentes de EE.UU. y figuras legales emblemáticas que estudiaron en estas élites escuelas de derecho.')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {lawSchools.map((school) => (
              <div key={school.slug} className="bg-gray-soft rounded-xl p-5 border-t-4" style={{ borderColor: school.color }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center p-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={school.logoUrl} alt={school.shortName} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <p className="font-bold text-navy text-sm leading-tight">{school.shortName}</p>
                    <p className="text-xs text-gray-400">US News #{school.usNewsRanking} · {school.location.city}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {school.notableAlumni.map((alumnus, idx) => {
                    const isJustice = alumnus.startsWith('Justice') || alumnus.startsWith('Chief Justice')
                    const isPresident = alumnus.startsWith('President')
                    return (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className={`mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full ${isPresident ? 'bg-brand-orange' : isJustice ? 'bg-navy' : 'bg-gray-400'}`} />
                        <span className={isPresident || isJustice ? 'font-semibold text-navy' : 'text-gray-600'}>
                          {alumnus}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-brand-orange inline-block" /> U.S. Presidents</span>
            <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-navy inline-block" /> Supreme Court Justices</span>
            <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-gray-400 inline-block" /> Legal &amp; Public Figures</span>
          </div>
        </div>

        {ndLawPost && (
          <div className="mb-10">
            <h2 className="section-title mb-6">{t('Law School News', '法学院资讯', 'Noticias de Escuelas de Derecho')}</h2>
            <div className="max-w-md"><PostCard post={ndLawPost} /></div>
          </div>
        )}

        <div className="bg-gray-soft p-10 text-center mt-10">
          <h3 className="text-2xl font-bold text-navy mb-3">{t('Ready to Apply to Law School?', '准备好申请法学院了吗？', '¿Listo para Aplicar a la Escuela de Derecho?')}</h3>
          <p className="text-gray-500 mb-6">{t('Our advisors include law school graduates who can guide your application strategy from start to finish.', '我们的顾问均为法学院毕业生，能从头到尾为您提供全面的申请策略指导。', 'Nuestros asesores son egresados de escuelas de derecho que pueden orientar tu estrategia de solicitud de principio a fin.')}</p>
          <Link href="/shop" className="btn-primary">{t('Get Expert Guidance', '获取专业指导', 'Obtener Orientación Experta')}</Link>
        </div>
      </div>
    </div>
  )
}
