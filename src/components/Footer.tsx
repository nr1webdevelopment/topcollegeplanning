'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/lib/i18n'

export default function Footer() {
  const pathname = usePathname()
  const { t } = useLanguage()
  if (pathname?.startsWith('/dashboard')) return null

  const quickLinks = [
    { en: 'Notable Alumni', zh: '知名校友', es: 'Exalumnos Destacados', href: '/alumni' },
    { en: 'Privacy Policy', zh: '隐私政策', es: 'Política de Privacidad', href: '/privacy-policy' },
    { en: 'Term Of Service', zh: '服务条款', es: 'Términos de Servicio', href: '/terms' },
    { en: 'Disclaimer', zh: '免责声明', es: 'Aviso Legal', href: '/disclaimer' },
    { en: 'Advertise', zh: '广告合作', es: 'Publicidad', href: '/advertise' },
    { en: 'Career', zh: '职业发展', es: 'Carreras', href: '/career' },
    { en: 'FAQ', zh: '常见问题', es: 'Preguntas Frecuentes', href: '/faq' },
  ]

  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-5 text-white">{t('Quick Links', '快速链接', 'Enlaces Rápidos')}</h3>
            <ul className="space-y-3">
              {quickLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-300 hover:text-brand-orange transition-colors">
                    {t(link.en, link.zh, link.es)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Work with Us */}
          <div>
            <h3 className="text-lg font-bold mb-5 text-white">{t('Work with Us', '加入我们', 'Trabaja con Nosotros')}</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              {t(
                'We are looking for bright individuals to join our team. Please view our',
                '我们正在寻找优秀人才加入团队。请查看我们的',
                'Buscamos personas talentosas para unirse a nuestro equipo. Visita nuestra'
              )}{' '}
              <Link href="/career" className="text-brand-orange hover:underline">{t('Career Page', '招聘页面', 'Página de Empleos')}</Link>{' '}
              {t(
                'for openings. Send your resume and a 30 seconds video to the email address below.',
                '了解职位空缺。请将简历及30秒自我介绍视频发送至以下邮箱。',
                'para ver vacantes. Envía tu CV y un video de 30 segundos al correo indicado.'
              )}
            </p>
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <svg className="w-4 h-4 text-brand-orange flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:hello@topcollegeplanning.com" className="hover:text-brand-orange transition-colors">
                hello@topcollegeplanning.com
              </a>
            </div>
          </div>

          {/* Join Our Webinar */}
          <div>
            <h3 className="text-lg font-bold mb-5 text-white">{t('Join Our Webinar', '加入网络研讨会', 'Únete a Nuestro Webinar')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-300 text-sm">
                <svg className="w-4 h-4 text-brand-orange flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                </svg>
                <span>{t('Next Seminar: 8:00 PM ET, 30th of July (Monday)', '下期研讨会：美东时间7月30日（周一）晚8:00', 'Próximo Seminario: 8:00 PM ET, 30 de julio (lunes)')}</span>
              </li>
              <li className="flex items-start gap-3 text-gray-300 text-sm">
                <svg className="w-4 h-4 text-brand-orange flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                </svg>
                <a href="#" className="hover:text-brand-orange transition-colors">{t('Click Here to Join Our Zoom Call', '点击此处加入Zoom会议', 'Haz clic aquí para unirte a nuestra llamada Zoom')}</a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-5 text-white">{t('Want Latest Admission Tips?', '获取最新录取资讯', '¿Quieres los Últimos Consejos de Admisión?')}</h3>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder={t('Enter Your Email Here', '请输入您的邮箱', 'Ingresa tu correo aquí')}
                className="bg-navy-light border border-white/20 text-white placeholder-gray-400 px-4 py-3 focus:outline-none focus:border-brand-orange transition-colors"
              />
              <button
                type="submit"
                className="bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-3 px-4 transition-colors text-sm uppercase tracking-wide"
              >
                {t('Subscribe to Our FREE Newsletter!', '订阅免费资讯简报！', '¡Suscríbete a Nuestro Boletín Gratuito!')}
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-400">
          <span>{t('Experienced University and College advisors.', '经验丰富的大学升学顾问团队。', 'Asesores universitarios con amplia experiencia.')}</span>
          <span>{t('Copyright TopCollegePlanning.com © 2024. All rights reserved.', '版权所有 TopCollegePlanning.com © 2024。保留所有权利。', 'Copyright TopCollegePlanning.com © 2024. Todos los derechos reservados.')}</span>
        </div>
      </div>
    </footer>
  )
}
