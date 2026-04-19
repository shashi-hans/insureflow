import { Link } from 'react-router-dom'
import { Shield, Twitter, Linkedin, Instagram, Phone, Mail, MapPin } from 'lucide-react'

const links = {
  Products: [
    { label: 'Motor Insurance', href: '/motor/quote' },
    { label: 'Health Insurance', href: '/health' },
    { label: 'Travel Insurance', href: '/travel' },
    { label: 'Life Insurance', href: '/life' },
  ],
  Support: [
    { label: 'File a Claim', href: '/claims/new' },
    { label: 'Track Claim', href: '/claims' },
    { label: 'My Policies', href: '/dashboard' },
    { label: 'Help Center', href: '/help' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Blog', href: '/blog' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'IRDAI Disclosure', href: '/irdai' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white">
      {/* CTA strip */}
      <div className="bg-teal-gradient py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">
            Insure smarter. Live better.
          </h2>
          <p className="text-white/80 mb-6">Join 2 million+ Indians who trust InsureFlow for their protection needs.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/motor/quote" className="btn-primary">Get Free Motor Quote</Link>
            <Link to="/dashboard" className="btn-outline border-white/40 text-white hover:bg-white/10 hover:border-white">
              View My Policies
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-teal-gradient rounded-lg flex items-center justify-center">
                <Shield size={16} className="text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                Insure<span className="text-teal-400">Flow</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              India's most trusted insurance comparison platform. Get the best plans from top insurers — compare, choose, buy, and claim in minutes.
            </p>
            <div className="flex items-center gap-3">
              {[Twitter, Linkedin, Instagram].map((Icon, i) => (
                <button key={i} className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center transition-colors">
                  <Icon size={15} className="text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="font-semibold text-sm text-white mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {items.map(item => (
                  <li key={item.label}>
                    <Link to={item.href} className="text-sm text-slate-400 hover:text-teal-400 transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact row */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
            <div className="flex flex-col sm:flex-row gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-2"><Phone size={14}/><span>1800-266-9999 (Toll-Free)</span></div>
              <div className="flex items-center gap-2"><Mail size={14}/><span>support@insureflow.in</span></div>
              <div className="flex items-center gap-2"><MapPin size={14}/><span>Mumbai, Maharashtra</span></div>
            </div>
            <p className="text-xs text-slate-500">
              © 2026 InsureFlow Technologies Pvt. Ltd. | IRDAI Reg. No. CB-XXX/XX | CIN: U66000MH2024PTC000000
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
