'use client'
import Script from 'next/script'
import { useEffect } from 'react'

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    dataLayer: unknown[]
  }
}

export function Analytics() {
  const gid = process.env.NEXT_PUBLIC_GA_ID
  if (!gid) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gid}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gid}', { page_path: window.location.pathname });
      `}</Script>
      <AffiliateClickTracker />
    </>
  )
}

function AffiliateClickTracker() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest('.affiliate-link')
      if (!target) return
      const el = target as HTMLElement
      const toolId = el.dataset.toolId
      const toolName = el.dataset.toolName
      const hasAffiliate = el.dataset.hasAffiliate === 'true'
      const refSource = new URLSearchParams(window.location.search).get('ref') ?? 'direct'
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'affiliate_click', {
          tool_id: toolId,
          tool_name: toolName,
          has_affiliate: hasAffiliate,
          ref_source: refSource,
        })
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return null
}
