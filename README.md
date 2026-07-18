# صفر ديون — ZeroDebt

منظومة منتج رقمي جاهزة للبيع: حاسبة ويب عربية مجانية لسداد الديون + عدة Excel احترافية مدفوعة.

**اقرأ أولاً: [`BUSINESS_PLAN.md`](./BUSINESS_PLAN.md)** — خطة الإطلاق والتسعير والتسويق كاملة.

## مكونات المشروع

| المسار                              | الوصف                                                               |
| ----------------------------------- | ------------------------------------------------------------------- |
| `/`                                 | صفحة الهبوط التسويقية (عربي/إنجليزي، RTL)                           |
| `/app`                              | الحاسبة المجانية — كرة الثلج والانهيار الجليدي، رسم بياني، حفظ محلي |
| `/nh3`                              | محاكي الأمونيا السابق (أُبقي كما هو على مسار فرعي)                  |
| `product/عدة-التحرر-من-الديون.xlsx` | **المنتج المدفوع** — 5 أوراق عربية بصيغ حية                         |
| `product/generate_toolkit.py`       | مولّد ملف الـ Excel (لتعديل المنتج وإعادة توليده)                   |
| `src/lib/debt-model.ts`             | محرك حسابات السداد (مُختبر)                                         |
| `src/lib/config.ts`                 | ⬅ **ضع رابط متجرك هنا** (`STORE_URL`) قبل النشر                     |

## التشغيل محلياً

```bash
bun install
bun run dev        # ثم افتح http://localhost:5173
```

## النشر على Cloudflare (مجاني)

```bash
bun run build
bunx wrangler deploy   # يتطلب تسجيل دخول: bunx wrangler login
```

ثم اربط دومينك من لوحة Cloudflare → Workers → Custom Domains.

## تعديل المنتج المدفوع

```bash
pip install openpyxl
python3 product/generate_toolkit.py
```

عدّل الأسعار في `src/lib/i18n.tsx` (المفتاحان `toolkitPrice` و `toolkitPriceNote`).
