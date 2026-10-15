import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // پالت برند آرکان (برند گاید)
        pine: "#D6242A", // سبز کاج — اصلی
        "pine-dark": "#B51D23", // برای hover دکمه‌ها
        brass: "#0F8A6C", // برنجی — تأکید
        "brass-dark": "#0B6D55",
        bone: "#FAF7F5", // استخوانی — پس‌زمینه‌ی روشن
        sand: "#EAE4E0", // شنی — سطوح ثانویه
        ink: "#1F1F1F", // مرکبی — متن اصلی
        slate: "#6E6E73", // خاکستری‌سبز — متن فرعی
      },
      fontFamily: {
        heading: ["var(--font-vazirmatn)", "system-ui", "sans-serif"],
        body: ["var(--font-vazirmatn)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // مقیاس تایپ برند
        h1: ["3rem", { lineHeight: "1.2", fontWeight: "700" }], // 48px
        h2: ["2rem", { lineHeight: "1.3", fontWeight: "700" }], // 32px
        h3: ["1.5rem", { lineHeight: "1.4", fontWeight: "600" }], // 24px
        body: ["1.0625rem", { lineHeight: "1.8" }], // 17px
        caption: ["0.875rem", { lineHeight: "1.6" }], // 14px
      },
      borderRadius: {
        card: "12px",
        btn: "8px",
      },
      boxShadow: {
        // سایه‌های بسیار ملایم — بدون جلوه‌ی براق
        soft: "0 1px 2px rgba(20, 58, 50, 0.04), 0 8px 24px rgba(20, 58, 50, 0.05)",
        "soft-md": "0 2px 4px rgba(20, 58, 50, 0.05), 0 12px 32px rgba(20, 58, 50, 0.07)",
      },
      maxWidth: {
        content: "72rem", // 1152px — عرض ثابت دسکتاپ
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
