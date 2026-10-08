import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/whatsapp-login',
          '/whatsapp-preferences',
          '/matches/',
          '/whatsapp-register',
          '/whatsapp-find-matches',
          '/api/',
          '/profile/*/edit',
          '/_next/',
          '/static/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/dashboard/', '/api/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/dashboard/', '/api/'],
      },
    ],
    sitemap: 'https://vivahavedimatrimony.com/sitemap.xml',
  };
}
