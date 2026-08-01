/* Claude Code Course — shared behavior: theme, copy buttons, progress tracking */
(function () {
  var STORE_KEY = 'ccCourseDone';
  var THEME_KEY = 'ccCourseTheme';
  var TOTAL_LESSONS = 12;

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
      btn.textContent = 'העתק';
      btn.addEventListener('click', function () {
        var code = pre.querySelector('code');
        var text = (code ? code.innerText : pre.innerText).trim();
        navigator.clipboard.writeText(text).then(function () {
          btn.textContent = '✔ הועתק';
          setTimeout(function () { btn.textContent = 'העתק'; }, 1500);
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
        completeBtn.textContent = isDone ? '✔ הפרק הושלם — לחצו לביטול' : 'סמנו פרק זה כהושלם';
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
          ? 'עוד לא התחלתם — פרק 1 מחכה לכם 👇'
          : 'השלמתם ' + done.length + ' מתוך ' + TOTAL_LESSONS + ' פרקים (' + pct + '%)';
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
              fb.textContent = '✔ נכון!';
              fb.className = 'q-fb ok';
            } else {
              opt.classList.add('wrong');
              fb.textContent = '✖ לא מדויק — התשובה הנכונה מסומנת בירוק.';
              fb.className = 'q-fb no';
            }
            if (score && answered === qs.length) {
              score.textContent = 'התוצאה שלכם: ' + correct + ' מתוך ' + qs.length +
                (correct === qs.length ? ' — מושלם! 🎉' : correct >= qs.length - 1 ? ' — יפה מאוד!' : ' — שווה לרפרף שוב על הפרק.');
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
          results.innerHTML = '<div class="sr-empty">לא נמצאו תוצאות ל"' + query + '"</div>';
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
