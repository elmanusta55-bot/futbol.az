# Layihəyə Töhfə Qaydaları 🤝

Futbol.az layihəsinə töhfə vermək istədiyiniz üçün təşəkkür edirik! Bu sənəd sizə layihəyə necə kömək edə biləcəyinizi izah edir.

## Başlamaq üçün

1. Reponu fork edin
2. Öz branch-ınızı yaradın: `git checkout -b feature/yeni-funksiya`
3. Dəyişikliklərinizi edin
4. Commit edin: `git commit -m "feat: yeni funksiya əlavə edildi"`
5. Push edin: `git push origin feature/yeni-funksiya`
6. Pull Request açın

## Commit Mesajları

Commit mesajlarında [Conventional Commits](https://www.conventionalcommits.org/) standartına əməl edin:

- `feat:` – Yeni funksionallıq
- `fix:` – Xəta düzəlişi
- `docs:` – Sənədləşdirmə dəyişikliyi
- `style:` – Kod formatlaması (funksionallığa təsir etməyən)
- `refactor:` – Kod refaktorinqi
- `test:` – Test əlavəsi və ya düzəlişi
- `chore:` – Alət və konfiqurasiya dəyişiklikləri

## Kod Standartları

- **HTML**: Semantik teqlər istifadə edin, accessibility-yə diqqət yetirin
- **CSS**: BEM metodologiyasına yaxın adlandırma, CSS dəyişənləri istifadə edin
- **JavaScript**: ES6+ sintaksis, `'use strict'` istifadə edin
- Bütün fayllar UTF-8 kodlaşdırmasında olmalıdır
- İndentasiya: 4 boşluq (spaces)

## Yeni Səhifə Əlavə Etmək

Yeni səhifə əlavə edərkən:

1. `public/` qovluğunda HTML, CSS və JS fayllarını yaradın
2. Mövcud tema dəyişənlərini (`--bg`, `--surface`, `--card` və s.) istifadə edin
3. Dark/Light mode dəstəyi əlavə edin
4. Mobil-first responsive dizayn tətbiq edin
5. `sitemap.xml` faylını yeniləyin
6. `sw.js` (service worker) keşinə yeni faylları əlavə edin

## Test Etmə

```bash
npm test
```

Yeni funksionallıq əlavə edərkən `test/` qovluğuna müvafiq test faylı əlavə edin.

## Pull Request Qaydaları

- PR açmazdan əvvəl testlərin keçdiyindən əmin olun
- PR təsvirində nə dəyişdirdiyinizi aydın izah edin
- Əgər vizual dəyişiklik varsa, screenshot əlavə edin
- Bir PR-da bir mövzu ilə bağlı dəyişikliklər olsun

## Xəta Bildirişi

Xəta tapdıqda GitHub Issues bölməsində yeni issue açın:

1. Xətanın təsviri
2. Xətanı necə təkrarlamaq olar (addımlar)
3. Gözlənilən davranış
4. Faktiki davranış
5. Screenshot (əgər varsa)
6. Brauzer və OS məlumatı

## Əlaqə

Suallarınız varsa, GitHub Issues bölməsində soruşa bilərsiniz.

---

Töhfəniz üçün təşəkkür edirik! ⚽
