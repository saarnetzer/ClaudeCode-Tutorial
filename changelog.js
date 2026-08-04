/* Course version history — single source of truth.
   Newest entry first. app.js renders the footer version badge, the what's-new box
   and the changelog page, picking `title`/`changes` (Hebrew) or `titleEn`/`changesEn`
   according to the page's <html lang>. */
window.COURSE_CHANGELOG = [
  {
    version: "3.2.0",
    date: "2026-08-04",
    title: "הקורס עכשיו גם באנגלית",
    titleEn: "The course is now available in English",
    changes: [
      "🇺🇸 גרסה אנגלית מלאה: כל 13 הפרקים, הצ'יט-שיט, המילון ומדריכי ההקמה",
      "מתג שפה בראש כל עמוד — המעבר שומר על אותו פרק",
      "ההתקדמות משותפת בין השפות: פרק שסומן בעברית מסומן גם באנגלית"
    ],
    changesEn: [
      "🇮🇱 A full Hebrew version alongside the English one: all 13 lessons, the cheat sheet, the glossary and the setup guides",
      "A language switcher at the top of every page — switching keeps you on the same lesson",
      "Progress is shared across languages: a lesson marked in one is marked in the other"
    ]
  },
  {
    version: "3.1.0",
    date: "2026-08-04",
    title: "תעודת סיום, רישיון פתוח ושיפורי חוויה",
    titleEn: "Completion certificate, open license and experience improvements",
    changes: [
      "🎓 תעודת סיום אישית — מסיימים את כל 13 הפרקים ומפיקים תעודה עם השם שלכם",
      "כפתור \"המשיכו מאיפה שעצרתם\" בעמוד הראשי",
      "התוכן שוחרר ברישיון פתוח CC BY-NC-SA 4.0 — מותר לשתף, לתרגם ולהתאים",
      "עמוד 404 ידידותי ובודק קישורים אוטומטי שבועי"
    ],
    changesEn: [
      "🎓 A personal completion certificate — finish all 13 lessons and generate one with your name on it",
      "A \"continue where you left off\" button on the home page",
      "The content was released under the open CC BY-NC-SA 4.0 license — sharing, translating and adapting are allowed",
      "A friendly 404 page and a weekly automated link checker"
    ]
  },
  {
    version: "3.0.0",
    date: "2026-08-03",
    title: "פרק אבטחה חדש ומבנה של 13 פרקים",
    titleEn: "A new security lesson and a 13-lesson structure",
    changes: [
      "פרק 9 חדש: לשלוט במה שמותר — אבטחה בעבודה עם סוכן (allow/deny, סודות, הזרקת פרומפט)",
      "הפרקים הקודמים 9–12 מוספרו מחדש ל-10–13; ההתקדמות השמורה שלכם נשמרת",
      "ניהול גרסאות: מספר גרסה בכל עמוד, עמוד היסטוריה מלא ותיבת \"מה חדש\"",
      "עמוד משוב חדש לדיווח בעיות והצעות"
    ],
    changesEn: [
      "New Lesson 9: controlling what's allowed — agent security (allow/deny, secrets, prompt injection)",
      "Former lessons 9–12 were renumbered to 10–13; your saved progress is preserved",
      "Version management: a version number on every page, a full history page and a \"what's new\" box",
      "A new feedback page for reporting issues and suggestions"
    ]
  },
  {
    version: "2.1.0",
    date: "2026-08-02",
    title: "כלי עזר ולמידה",
    titleEn: "Reference and learning tools",
    changes: [
      "צ'יט-שיט: כל הפקודות בעמוד אחד · מילון מונחים",
      "בוחן עצמי בסוף כל פרק · חיפוש בכל הקורס · הדגמות טרמינל חיות",
      "מדריכי הקמה: הטרמינל מאפס, Git ו-GitHub מאפס",
      "פרויקט תרגול להורדה עם באגים מוטמנים"
    ],
    changesEn: [
      "Cheat sheet: every command on one page · a glossary of terms",
      "A self-check quiz at the end of every lesson · search across the course · live terminal demos",
      "Setup guides: the terminal from scratch, Git and GitHub from scratch",
      "A downloadable practice project with planted bugs"
    ]
  },
  {
    version: "2.0.0",
    date: "2026-08-01",
    title: "צוותי סוכנים",
    titleEn: "Agent squads",
    changes: [
      "שני פרקים חדשים: יצירת צוות סוכנים + צוותים מחמישה עולמות",
      "100 קובצי סוכנים מוכנים להורדה, מקושרים מהטבלאות"
    ],
    changesEn: [
      "Two new lessons: building an agent squad + squads from five industries",
      "100 ready-made agent files, downloadable straight from the tables"
    ]
  },
  {
    version: "1.0.0",
    date: "2026-08-01",
    title: "השקה",
    titleEn: "Launch",
    changes: [
      "עשרת הפרקים הראשונים: מההתקנה ועד ה-Agent SDK",
      "האתר עולה לאוויר ב-GitHub Pages"
    ],
    changesEn: [
      "The first ten lessons: from install to the Agent SDK",
      "The site goes live on GitHub Pages"
    ]
  }
];
