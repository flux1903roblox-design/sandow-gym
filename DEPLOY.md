# פריסה והתקנה בטלפון — Sandow PWA

האפליקציה היא PWA: מספיק לארח את תיקיית `dist/` בכל hosting עם HTTPS, ואז להתקין מהדפדפן בטלפון ("הוסף למסך הבית"). אין צורך ב‑App Store / Apple Developer.

```powershell
npm run build   # יוצר את תיקיית dist/
```

## אפשרות 1 — Netlify Drop (הכי מהיר, בלי חשבון)
1. היכנס ל‑https://app.netlify.com/drop
2. גרור לשם את תיקיית **`dist`** (לא את הפרויקט כולו).
3. מקבלים מיד קישור `https://<name>.netlify.app`.
   קובץ `_redirects` כבר בתוך `dist` → הניווט הפנימי (למשל `/workouts/123`) יעבוד.

## אפשרות 2 — Vercel (CLI)
```powershell
npm i -g vercel
vercel deploy .\dist --prod
```
(`vercel.json` כבר מגדיר rewrites ל‑SPA.) הרצה ראשונה תבקש התחברות בדפדפן.

## אפשרות 3 — Netlify מחובר ל‑Git
חבר ריפו ל‑Netlify; `netlify.toml` כבר מגדיר `build = npm run build`, `publish = dist`.

## התקנה בטלפון (אחרי שיש קישור HTTPS)
- **iPhone (Safari):** פתח את הקישור ← כפתור שיתוף ← **הוסף למסך הבית**.
- **Android (Chrome):** פתח את הקישור ← תופיע הצעת **התקנה** (או תפריט ⋮ ← "התקן אפליקציה").
האפליקציה תיפתח במסך מלא, עם אייקון, ותעבוד גם ללא אינטרנט.

## בדיקה מהירה בטלפון בלי לפרוס (אותו פרויקט, קישור זמני)
בטרמינל אחד:
```powershell
npm run build
npm run preview        # מגיש על http://localhost:4173
```
בטרמינל שני:
```powershell
npm run share          # מייצר קישור https זמני (localtunnel) לטלפון
```
פתח את הקישור שמתקבל בטלפון. (זמני — קיים כל עוד הטרמינלים פתוחים; ב‑localtunnel ייתכן מסך ביניים שמבקש את כתובת ה‑IP הציבורי כ"סיסמה".)

## בדיקה ברשת מקומית (Wi‑Fi משותף)
```powershell
$env:HTTPS="true"; npm run dev
```
פתח בטלפון את כתובת ה‑Network שמודפסת (למשל `https://192.168.1.26:5173`) ואשר את אזהרת התעודה.
> ב‑iPhone אישור תעודה עצמית מסורבל — לכן ל‑iOS עדיף מסלול ה‑Netlify Drop.
