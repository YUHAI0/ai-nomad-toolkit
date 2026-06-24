import Script from 'next/script'

export function AdSenseScript() {
  const id = process.env.NEXT_PUBLIC_ADSENSE_ID
  if (!id) return null
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${id}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  )
}

export function AdUnit({ slot, className }: { slot: string; className?: string }) {
  const id = process.env.NEXT_PUBLIC_ADSENSE_ID
  if (!id) {
    return (
      <div className={`bg-slate-100 rounded border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs ${className ?? ''}`}>
        广告位
      </div>
    )
  }
  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={id}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
