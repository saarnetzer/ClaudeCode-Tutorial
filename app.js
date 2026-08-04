/* Claude Code Course — shared behavior. Bilingual: strings switch on <html lang="en">. */
var CC_EN = document.documentElement.lang === 'en';
function ccT(he, en) { return CC_EN ? en : he; }
/* Claude Code Course — shared behavior: theme, copy buttons, progress tracking */
(function () {
  var STORE_KEY = 'ccCourseDone';
  var THEME_KEY = 'ccCourseTheme';
  var TOTAL_LESSONS = 13;

  /* ---------- theme ---------- */
  function applyTheme(t) {
    if (t === 'light') document.documentElement.setAttribute('data-theme', 'light');
    else document.documentElement.removeAttribute('data-theme');
  }
  applyTheme(localStorage.getItem(THEME_KEY) || 'dark');

  function getDone() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; }
    catch (e) { return []; }
  }
  function setDone(arr) { localStorage.setItem(STORE_KEY, JSON.stringify(arr)); }

  document.addEventListener('DOMContentLoaded', function () {
    /* theme toggle button */
    var themeBtn = document.getElementById('themeBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        var next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        localStorage.setItem(THEME_KEY, next);
        applyTheme(next);
      });
    }

    /* copy buttons on every <pre> */
    document.querySelectorAll('pre').forEach(function (pre) {
      var btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = ccT('העתק', 'Copy');
      btn.addEventListener('click', function () {
        var code = pre.querySelector('code');
        var text = (code ? code.innerText : pre.innerText).trim();
        navigator.clipboard.writeText(text).then(function () {
          btn.textContent = ccT('✔ הועתק', '✔ Copied');
          setTimeout(function () { btn.textContent = ccT('העתק', 'Copy'); }, 1500);
        });
      });
      pre.appendChild(btn);
    });

    var done = getDone();

    /* lesson page: complete button */
    var completeBtn = document.getElementById('completeBtn');
    if (completeBtn) {
      var lessonId = completeBtn.dataset.lesson;
      function render() {
        var isDone = getDone().indexOf(lessonId) !== -1;
        completeBtn.classList.toggle('done', isDone);
        completeBtn.textContent = isDone ? ccT('✔ הפרק הושלם — לחצו לביטול', '✔ Lesson complete — click to undo') : ccT('סמנו פרק זה כהושלם', 'Mark this lesson complete');
      }
      completeBtn.addEventListener('click', function () {
        var d = getDone();
        var i = d.indexOf(lessonId);
        if (i === -1) {
          d.push(lessonId);
          if (window.goatcounter && window.goatcounter.count) {
            window.goatcounter.count({ path: 'complete-' + lessonId, title: 'Lesson completed: ' + lessonId, event: true });
          }
        } else {
          d.splice(i, 1);
        }
        setDone(d);
        render();
      });
      render();
    }

    /* index page: mark chapters + progress bar */
    var bar = document.getElementById('progressBar');
    if (bar) {
      document.querySelectorAll('.toc a.chapter').forEach(function (a) {
        if (done.indexOf(a.dataset.lesson) !== -1) {
          a.classList.add('done');
          var num = a.querySelector('.num');
          if (num) num.textContent = '✔';
        }
      });
      var pct = Math.round((done.length / TOTAL_LESSONS) * 100);
      bar.style.width = pct + '%';
      var label = document.getElementById('progressLabel');
      if (label) {
        label.textContent = done.length === 0
          ? ccT('עוד לא התחלתם — פרק 1 מחכה לכם 👇', "You haven't started yet — Lesson 1 is waiting 👇")
          : ccT('השלמתם ', 'Completed ') + done.length + ccT(' מתוך ', ' of ') + TOTAL_LESSONS + ccT(' פרקים (', ' lessons (') + pct + '%)';
      }
    }
  });
})();

/* ===== quiz, terminal demos, search ===== */
(function () {
  document.addEventListener('DOMContentLoaded', function () {

    /* ---------- self-quiz ---------- */
    document.querySelectorAll('.quiz').forEach(function (quiz) {
      var qs = quiz.querySelectorAll('.q');
      var answered = 0, correct = 0;
      var score = quiz.querySelector('.quiz-score');
      qs.forEach(function (q) {
        var right = parseInt(q.dataset.a, 10);
        var opts = q.querySelectorAll('.opt');
        var fb = q.querySelector('.q-fb');
        opts.forEach(function (opt, i) {
          opt.addEventListener('click', function () {
            if (q.dataset.done) return;
            q.dataset.done = '1';
            answered++;
            opts.forEach(function (o) { o.disabled = true; });
            opts[right].classList.add('correct');
            if (i === right) {
              correct++;
              fb.textContent = ccT('✔ נכון!', '✔ Correct!');
              fb.className = 'q-fb ok';
            } else {
              opt.classList.add('wrong');
              fb.textContent = ccT('✖ לא מדויק — התשובה הנכונה מסומנת בירוק.', '✖ Not quite — the right answer is marked in green.');
              fb.className = 'q-fb no';
            }
            if (score && answered === qs.length) {
              score.textContent = ccT('התוצאה שלכם: ', 'Your score: ') + correct + ccT(' מתוך ', ' of ') + qs.length +
                (correct === qs.length ? ccT(' — מושלם! 🎉', ' — perfect! 🎉') : correct >= qs.length - 1 ? ccT(' — יפה מאוד!', ' — nicely done!') : ccT(' — שווה לרפרף שוב על הפרק.', ' — worth skimming the lesson again.'));
            }
          });
        });
      });
    });

    /* ---------- terminal demos ---------- */
    function runDemo(demo) {
      var screen = demo.querySelector('.td-screen');
      var scriptEl = demo.querySelector('.td-script');
      if (!screen || !scriptEl) return;
      var steps;
      try { steps = JSON.parse(scriptEl.textContent); } catch (e) { return; }
      screen.innerHTML = '';
      var cursor = document.createElement('span');
      cursor.className = 'td-cursor';
      screen.appendChild(cursor);
      var i = 0;
      function addSpan(cls, text) {
        var sp = document.createElement('span');
        sp.className = cls;
        sp.textContent = text;
        screen.insertBefore(sp, cursor);
      }
      function next() {
        if (i >= steps.length) { cursor.remove(); return; }
        var kind = steps[i][0], text = steps[i][1];
        i++;
        if (kind === 'cmd') {
          addSpan('td-prompt', '$ ');
          var j = 0;
          (function typeChar() {
            if (j < text.length) {
              addSpan('td-cmd', text[j]);
              j++;
              screen.scrollTop = screen.scrollHeight;
              setTimeout(typeChar, 28 + Math.random() * 40);
            } else {
              addSpan('td-cmd', '\n');
              setTimeout(next, 350);
            }
          })();
        } else {
          addSpan(kind === 'claude' ? 'td-claude' : 'td-out', text + '\n');
          screen.scrollTop = screen.scrollHeight;
          setTimeout(next, kind === 'pause' ? 700 : 220);
        }
      }
      next();
    }
    document.querySelectorAll('.termdemo').forEach(function (demo) {
      var replay = demo.querySelector('.td-replay');
      if (replay) replay.addEventListener('click', function () { runDemo(demo); });
      var seen = false;
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !seen) { seen = true; runDemo(demo); obs.disconnect(); }
        });
      }, { threshold: 0.4 });
      obs.observe(demo);
    });

    /* ---------- search (index page) ---------- */
    var input = document.getElementById('searchInput');
    var results = document.getElementById('searchResults');
    if (input && results) {
      var index = null;
      fetch('search-index.json').then(function (r) { return r.json(); })
        .then(function (d) { index = d; }).catch(function () {});
      function render(list, query) {
        results.innerHTML = '';
        if (!query) { results.classList.remove('open'); return; }
        if (!list.length) {
          results.innerHTML = '<div class="sr-empty">' + ccT('לא נמצאו תוצאות ל"', 'No results for "') + query + '"</div>';
          results.classList.add('open');
          return;
        }
        list.slice(0, 8).forEach(function (r) {
          var a = document.createElement('a');
          a.href = r.url;
          var pos = r.text.indexOf(r.hit);
          var start = Math.max(0, pos - 40);
          var snip = (start > 0 ? '…' : '') + r.text.slice(start, pos + 90) + '…';
          a.innerHTML = '<span class="sr-title">' + r.title + '</span><br><span class="sr-snip"></span>';
          a.querySelector('.sr-snip').textContent = snip;
          results.appendChild(a);
        });
        results.classList.add('open');
      }
      input.addEventListener('input', function () {
        var q = input.value.trim();
        if (!index || q.length < 2) { render([], ''); return; }
        var terms = q.split(/\s+/);
        var scored = [];
        index.forEach(function (page) {
          var hay = (page.title + ' ' + page.text);
          var score = 0, firstHit = '';
          terms.forEach(function (t) {
            var c = hay.split(t).length - 1;
            if (c > 0 && !firstHit) firstHit = t;
            score += c * (page.title.indexOf(t) !== -1 ? 5 : 1);
          });
          if (score > 0) scored.push({ url: page.url, title: page.title, text: page.text, hit: firstHit, score: score });
        });
        scored.sort(function (a, b) { return b.score - a.score; });
        render(scored, q);
      });
      document.addEventListener('click', function (e) {
        if (!results.contains(e.target) && e.target !== input) results.classList.remove('open');
      });
    }
  });
})();

/* ===== versioning: footer badge, what's-new box, changelog page ===== */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var log = window.COURSE_CHANGELOG;
    if (!log || !log.length) return;
    var latest = log[0];
    function relTitle(rel) { return CC_EN ? (rel.titleEn || rel.title) : rel.title; }
    function relChanges(rel) { return CC_EN ? (rel.changesEn || rel.changes) : rel.changes; }
    function fmtDate(iso) {
      var p = iso.split('-');
      if (CC_EN) {
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return months[parseInt(p[1], 10) - 1] + ' ' + p[2].replace(/^0/, '') + ', ' + p[0];
      }
      return p[2].replace(/^0/, '') + '.' + p[1].replace(/^0/, '') + '.' + p[0];
    }

    /* footer version badge on every page */
    var footer = document.querySelector('footer.site');
    if (footer) {
      var sep = document.createTextNode(' · ');
      var a = document.createElement('a');
      a.href = 'changelog.html';
      a.textContent = ccT('גרסה ', 'v') + latest.version;
      footer.appendChild(sep);
      footer.appendChild(a);
    }

    /* what's-new box on the home page */
    var box = document.getElementById('whatsNew');
    if (box) {
      var items = relChanges(latest);
      var h = '<div class="callout info"><span class="co-title">' +
              ccT('🆕 מה חדש בגרסה ', '🆕 What\'s new in v') + latest.version +
              ' <span style="font-weight:400;opacity:.7">(' + fmtDate(latest.date) + ')</span></span><ul style="margin:.4rem 0">';
      items.forEach(function () { h += '<li></li>'; });
      h += '</ul><p style="margin:.4rem 0 0;font-size:.9rem"><a href="changelog.html">' +
           ccT('כל היסטוריית הגרסאות', 'Full version history') + '</a> · <a href="feedback.html">' +
           ccT('שלחו משוב', 'Send feedback') + '</a></p></div>';
      box.innerHTML = h;
      var lis = box.querySelectorAll('li');
      items.forEach(function (c, i) { lis[i].textContent = c; });
    }

    /* full changelog page */
    var list = document.getElementById('changelogList');
    if (list) {
      log.forEach(function (rel) {
        var div = document.createElement('div');
        div.className = 'exercise';
        var head = document.createElement('div');
        head.className = 'ex-head';
        head.innerHTML = '<span class="ex-badge"></span><span></span><span style="margin-inline-start:auto;font-weight:400;color:var(--text3);font-size:.85rem"></span>';
        head.children[0].textContent = ccT('גרסה ', 'v') + rel.version;
        head.children[1].textContent = relTitle(rel);
        head.children[2].textContent = fmtDate(rel.date);
        var ul = document.createElement('ul');
        relChanges(rel).forEach(function (c) {
          var li = document.createElement('li');
          li.textContent = c;
          ul.appendChild(li);
        });
        div.appendChild(head);
        div.appendChild(ul);
        list.appendChild(div);
      });
    }
  });
})();

/* ===== continue button + completion certificate (home page) ===== */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var bar = document.getElementById('progressBar');
    if (!bar) return;
    var TOTAL = 13;
    var done = [];
    try { done = JSON.parse(localStorage.getItem('ccCourseDone')) || []; } catch (e) {}

    /* continue where you left off: first chapter card (in display order) not done */
    var row = document.getElementById('continueRow');
    var btn = document.getElementById('continueBtn');
    if (row && btn && done.length > 0 && done.length < TOTAL) {
      var cards = document.querySelectorAll('.toc a.chapter');
      for (var i = 0; i < cards.length; i++) {
        if (done.indexOf(cards[i].dataset.lesson) === -1) {
          var title = cards[i].querySelector('.ch-title');
          btn.href = cards[i].getAttribute('href');
          btn.textContent = ccT('▶ המשיכו מפרק ', '▶ Continue from Lesson ') + (i + 1) + ': ' + (title ? title.textContent : '');
          row.style.display = '';
          break;
        }
      }
    }

    /* certificate when everything is complete */
    var certRow = document.getElementById('certRow');
    var certBtn = document.getElementById('certBtn');
    if (certRow && certBtn && done.length >= TOTAL) {
      certRow.style.display = '';
      certBtn.addEventListener('click', function () {
        var name = prompt(ccT('איך לרשום את השם על התעודה?', 'What name should appear on the certificate?'));
        if (!name || !name.trim()) return;
        name = name.trim();
        var version = (window.COURSE_CHANGELOG && window.COURSE_CHANGELOG[0]) ? window.COURSE_CHANGELOG[0].version : '';
        var c = document.createElement('canvas');
        c.width = 1600; c.height = 1131;
        var x = c.getContext('2d');
        x.fillStyle = '#12100e'; x.fillRect(0, 0, 1600, 1131);
        x.strokeStyle = '#d97757'; x.lineWidth = 6;
        x.strokeRect(50, 50, 1500, 1031);
        x.strokeStyle = '#3a332c'; x.lineWidth = 2;
        x.strokeRect(70, 70, 1460, 991);
        x.textAlign = 'center'; x.direction = CC_EN ? 'ltr' : 'rtl';
        x.fillStyle = '#d97757';
        x.font = '110px "Segoe UI", sans-serif';
        x.fillText('\u2733', 800, 240);
        x.fillStyle = '#ece5dd';
        x.font = 'bold 84px "Segoe UI", "Heebo", sans-serif';
        x.fillText(ccT('תעודת סיום', 'Certificate of Completion'), 800, 380);
        x.fillStyle = '#b3a99c';
        x.font = '38px "Segoe UI", sans-serif';
        x.fillText(ccT('מוענקת בזאת אל', 'Awarded to'), 800, 470);
        x.fillStyle = '#e8956f';
        x.font = 'bold 72px "Segoe UI", "Heebo", sans-serif';
        x.fillText(name, 800, 580);
        x.fillStyle = '#ece5dd';
        x.font = '40px "Segoe UI", sans-serif';
        x.fillText(ccT('על השלמת קורס Claude Code בעברית', 'for completing the Claude Code course'), 800, 690);
        x.fillStyle = '#b3a99c';
        x.font = '34px "Segoe UI", sans-serif';
        x.fillText(ccT('13 פרקים · מאפס ועד צוותי סוכנים אוטונומיים', '13 lessons · from zero to autonomous agent squads'), 800, 755);
        var d = new Date();
        var dateStr = d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear();
        x.fillText(dateStr + (version ? ccT(' · גרסת קורס ', ' · course version ') + version : ''), 800, 880);
        x.fillStyle = '#7d746a';
        x.font = '28px Consolas, monospace';
        x.direction = 'ltr';
        x.fillText('saarnetzer.github.io/ClaudeCode-Tutorial', 800, 990);
        var a = document.createElement('a');
        a.download = 'claude-code-course-certificate.png';
        a.href = c.toDataURL('image/png');
        a.click();
        if (window.goatcounter && window.goatcounter.count) {
          window.goatcounter.count({ path: 'certificate-generated', title: 'Certificate generated', event: true });
        }
      });
    }
  });
})();
