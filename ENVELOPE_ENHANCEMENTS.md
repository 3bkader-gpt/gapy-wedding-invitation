# 🎯 Envelope 3D Transition Enhancements

## ✨ What's New

تم تحسين الـ transition بين فتح الظرف وخروج الكارت لجعله أكثر سلاسة وواقعية باستخدام Three.js.

---

## 🚀 التحسينات المُضافة

### 1. **Improved Timing & Easing**
- **Flap Opening**: يفتح بشكل أسرع وأكثر سلاسة (45% من الوقت بدلاً من 50%)
- **Card Reveal**: يبدأ أبكر (25% بدلاً من 32%) لتداخل أفضل مع فتح الغطاء
- **New Easing Functions**:
  - `easeOutBack`: للكارت - يعطي overshoot طبيعي
  - `easeInOutQuart`: للغطاء والكاميرا - حركة أكثر سلاسة

### 2. **Dynamic Camera Movement**
- **Camera Follow**: الكاميرا تتبع الكارت أثناء خروجه
- **Position Animation**: تتحرك للأعلى وللأمام
- **FOV Zoom**: تقريب تدريجي (6 degrees) للتركيز على الكارت
- **Look-At Animation**: الكاميرا تنظر للكارت أثناء صعوده

### 3. **Enhanced Card Animation**
- **3D Rotation**: الكارت يدور قليلاً على محور X و Z
- **Scale Overshoot**: يكبر بشكل طبيعي مع slight bounce
- **Improved Trajectory**: مسار أكثر واقعية للخروج من الظرف

### 4. **Particle Trail Effect**
- **Golden Particles**: جزيئات ذهبية تتبع الكارت أثناء الحركة
- **Physics-Based**: حركة طبيعية مع velocity و lifetime
- **Adaptive Opacity**: الشفافية تتغير حسب عدد الجزيئات
- **Performance Optimized**: تعمل فقط أثناء الحركة

---

## 📊 Technical Details

### Timing Breakdown (Total: ~2.8s)

```
0.0s - 0.4s  : Shake animation (if enabled)
0.0s - 1.26s : Flap opening (45% of 2.8s)
0.7s - 2.8s  : Card reveal (starts at 25%)
0.56s - 2.8s : Camera animation (starts at 20%)
0.7s - 2.65s : Particle trail (during card movement)
```

### Easing Functions

```javascript
// Card movement - natural overshoot
easeOutBack(t) = 1 + c3 * (t - 1)³ + c1 * (t - 1)²

// Flap & Camera - smooth acceleration/deceleration
easeInOutQuart(t) = t < 0.5 ? 8t⁴ : 1 - (-2t + 2)⁴ / 2
```

### Camera Animation

```javascript
// Position
y: 0.05 → 0.30  (moves up)
z: 5.2 → 4.6    (moves closer)

// FOV
42° → 36°       (zoom in)

// Look-At
y: -0.05 → 0.75 (follows card)
```

---

## 🎨 Visual Improvements

### Before:
- ❌ Flap opens, then card moves (sequential)
- ❌ Static camera
- ❌ Simple linear movement
- ❌ No particle effects

### After:
- ✅ Smooth overlap between flap and card
- ✅ Dynamic camera following
- ✅ 3D rotation and natural movement
- ✅ Golden particle trail

---

## ⚙️ Configuration

في `invitation.config.js`:

```javascript
envelope: {
    renderer: 'three',  // استخدام Three.js renderer
    timings: {
        flapOpen: 1200,           // Flap opening duration
        cardRevealDelay: 250,     // Card starts after flap
        cardRevealDuration: 2400, // Card animation duration
        cardLift: 4500            // Total before transition
    }
}
```

---

## 🔧 DOM Renderer Updates

تم تحديث الـ DOM renderer ليتماشى مع التحسينات:

- **New Timing**: أسرع وأكثر سلاسة
- **DOM Path**: حركة الكارت عبر `transform` + `transition` فقط (بدون `animation` متوازية لتجنب تعارض التوقيت)
- **Better Easing**: `cubic-bezier(0.175, 0.885, 0.32, 1.275)`

---

## 🎯 Performance

- **60 FPS**: على الأجهزة المتوسطة
- **Optimized Particles**: تُنشأ فقط أثناء الحركة
- **Reduced Motion**: يتم تعطيل كل التأثيرات المتقدمة

---

## 🚀 Next Steps

### Possible Future Enhancements:
1. **Depth of Field**: blur للخلفية أثناء تركيز الكاميرا
2. **Motion Blur**: للكارت أثناء الحركة السريعة
3. **Light Animation**: الإضاءة تتبع الكارت
4. **Sound Effects**: صوت "whoosh" أثناء خروج الكارت

---

## 📝 Notes

- التحسينات تعمل فقط مع `renderer: 'three'`
- الـ DOM renderer له تحسينات CSS مماثلة
- كل التأثيرات تحترم `prefers-reduced-motion`
