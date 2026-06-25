import { MetadataRoute } from 'next'

function getSiteUrl() {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL ??
    'https://yourdomain.com'

  return url.startsWith('http') ? url : `https://${url}`
}

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl()
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/admin/' },
    sitemap: `${base}/sitemap.xml`,
  }
}
