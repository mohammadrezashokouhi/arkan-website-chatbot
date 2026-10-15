import Link from "next/link";
import Script from "next/script";
import Logo from "@/components/ui/Logo";
export default function Home() {
 return <><header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6"><Logo /><Link href="/chat" className="rounded-btn bg-pine px-5 py-2 text-white">شروع گفتگو</Link></header>
 <main id="main" className="mx-auto max-w-6xl px-6 pb-24 pt-14 sm:pt-24">
 <p className="mb-6 text-sm tracking-widest text-slate" dir="ltr">VANCOUVER, BC · RAYAN DIGITAL</p>
 <div className="max-w-3xl"><h1 className="text-4xl font-bold leading-relaxed text-ink sm:text-6xl">شریک رشد دیجیتال<br /><span className="text-pine">کسب‌وکار شما.</span></h1>
 <p className="mt-8 max-w-xl text-lg leading-9 text-slate">از طراحی سایت تا سئو و دیجیتال مارکتینگ، با هم مسیر متناسب با کسب‌وکار شما را پیدا می‌کنیم. از دستیار فارسی رایان بپرسید و درخواست مشاوره‌تان را همین‌جا ثبت کنید.</p>
 <Link href="/chat" className="mt-8 inline-flex rounded-btn bg-pine px-7 py-4 text-white hover:bg-pine-dark">گفتگو با دستیار رایان ←</Link>
 <p className="mt-4 text-sm text-slate">شفاف، دقیق، همراه با شما.</p></div>
 <div className="mt-20 grid gap-5 border-t border-sand pt-8 md:grid-cols-3">{[["۰۱", "طراحی سایت", "حضوری حرفه‌ای متناسب با نیاز واقعی کسب‌وکار شما."],["۰۲", "سئو", "کمک به دیده‌شدن در جست‌وجوی مشتریان مرتبط."],["۰۳", "دیجیتال مارکتینگ", "مسیر جذب مشتری با هدف روشن و گزارش شفاف."]].map(([n,t,d])=><div key={n} className="rounded-card border border-sand bg-white p-6"><span className="text-sm text-pine">{n}</span><h2 className="mt-4 text-xl font-bold text-ink">{t}</h2><p className="mt-3 text-sm leading-7 text-slate">{d}</p></div>)}</div>
 </main><footer className="border-t border-sand px-6 py-6 text-center text-sm text-slate" dir="ltr">Rayan Digital · Your Digital Growth Partner</footer><Script src="/widget.js" strategy="afterInteractive" /></>;
}
