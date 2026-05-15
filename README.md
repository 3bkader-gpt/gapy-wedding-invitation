# دعوة زفاف ندا وأحمد

دعوة رقمية بالعربية (RTL) مع مشهد ظرف 3D عند أول زيارة في الجلسة، ثم انتقال سلس إلى صفحة الدعوة الكاملة.

## التشغيل المحلي

ES modules تحتاج سيرفر HTTP (لا تفتح `index.html` مباشرة عبر `file://`):

```powershell
Set-Location d:\gapy
python -m http.server 8765
```

ثم افتح: http://localhost:8765

## الهيكل

```
gapy/
├── index.html
├── config/invitation.config.js
├── assets/envelope/patterns/, flowers.svg
├── styles/tokens.css, envelope.css, invitation.css
└── scripts/
    ├── main.js
    ├── core/storage.js, motion.js
    ├── envelope/
    │   ├── envelope-controller.js
    │   ├── animation-controller.js
    │   ├── scene-ui.js
    │   ├── particle-system.js
    │   ├── parallax.js
    │   └── config-helpers.js
    └── invitation/countdown.js, calendar.js, effects.js, invitation-app.js
```

## السلوك

- **كل زيارة / تحديث:** تحميل (اختياري) → رسالة ترحيب → ظرف 3D + ختم → ضغط الختم → اهتزاز/ذوبان/فتح → confetti (اختياري) → الدعوة + AOS + العداد.
- **`prefers-reduced-motion`:** المشهد يظهر لكن بدون حركات زخرفية؛ ضغط الختم يفتح الظرف فوراً.

## تحسينات الظرف (Req 1–21)

كل ميزة تُفعَّل/تُعطَّل من `config/invitation.config.js` → `envelope.enhancements`:

| المرحلة | أمثلة |
|---------|--------|
| `quick` | أنماط إسلامية، لمعان الختم، ظلال، ملمس ورق |
| `medium` | شريط، زهور، اهتزاز، جزيئات ذهبية، كشف البطاقة، ذوبان الختم |
| `advanced` | confetti، parallax، ترحيب، تحميل، تعليمات |

## التعديل

النصوص، الروابط، توقيت العد، أحداث التقويم، ومراحل التحسينات في `config/invitation.config.js`.
