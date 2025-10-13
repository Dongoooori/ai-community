'use client';

import Link from 'next/link';

const footerData = {
  brand: {
    name: 'Tokyo AI Community',
    description: 'AI 기술과 혁신을 위한 실험실',
  },
  laboratory: [
    { label: 'AI Research Lab', href: '#ai-research' },
    { label: 'Robotics Lab', href: '#robotics' },
    { label: 'Data Science Lab', href: '#data-science' },
  ],
  social: [
    { label: 'GitHub', href: 'https://github.com' },
    { label: 'Twitter', href: 'https://twitter.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
  ],
}

export default function Footer() {
  return (
    <footer className="w-full h-full bg-card border-t border-border">
      <div className="w-full px-4 py-12">
        <div className="flex gap-20">
          {/* 브랜드 섹션 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              {footerData.brand.name}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {footerData.brand.description}
            </p>
          </div>

          {/* 실험실 섹션 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Laboratory
            </h3>
            <ul className="space-y-2">
              {footerData.laboratory.map((lab) => (
                <li key={lab.href}>
                  <Link
                    href={lab.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {lab.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 소셜 미디어 섹션 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Follow Us
            </h3>
            <ul className="space-y-2">
              {footerData.social.map((social) => (
                <li key={social.href}>
                  <Link
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {social.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 하단 저작권 */}
        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-center text-muted-foreground text-sm">
            © 2024 Tokyo AI Community. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
