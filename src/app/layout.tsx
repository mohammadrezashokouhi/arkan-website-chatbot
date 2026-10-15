import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

// فونت عناوین — استعداد
const estedad = localFont({
  src: [
    { path: "../../public/fonts/Estedad-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/Estedad-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/Estedad-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/Estedad-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-estedad",
  display: "swap",
  preload: true,
});

// فونت بدنه — وزیرمتن
const vazirmatn = localFont({
  src: [
    { path: "../../public/fonts/Vazirmatn-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/Vazirmatn-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/Vazirmatn-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/Vazirmatn-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-vazirmatn",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
 title: { default: "رایان دیجیتال | شریک رشد دیجیتال شما", template: "%s | رایان دیجیتال" },
 description: "طراحی سایت، سئو و دیجیتال مارکتینگ در ونکوور. گفتگو با دستیار فارسی رایان دیجیتال و ثبت درخواست مشاوره.",
 icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#D6242A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={`${estedad.variable} ${vazirmatn.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          پرش به محتوای اصلی
        </a>
        {children}
      </body>
    </html>
  );
}
