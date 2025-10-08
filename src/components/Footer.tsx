'use client';

import Link from 'next/link';

interface FooterData {
  brand: {
    name: string;
    description: string;
  };
  laboratory: Array<{
    label: string;
    href: string;
  }>;
  social: Array<{
    label: string;
    href: string;
  }>;
}

interface FooterProps {
  data: FooterData;
}

export default function Footer({ data }: FooterProps) {
  return (
    <footer className="bg-card border-t border-border">
      <div className="w-full px-4 py-12">
        <div className="flex gap-20">
          {/* 브랜드 섹션 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              {data.brand.name}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {data.brand.description}
            </p>
          </div>

          {/* 실험실 섹션 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Laboratory
            </h3>
            <ul className="space-y-2">
              {data.laboratory.map((lab) => (
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
              {data.social.map((social) => (
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
