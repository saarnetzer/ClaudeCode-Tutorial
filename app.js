/* Claude Code Course — shared behavior: theme, copy buttons, progress tracking */
(function () {
  var STORE_KEY = 'ccCourseDone';
  var THEME_KEY = 'ccCourseTheme';
  var TOTAL_LESSONS = 10;

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
        if (i === -1) d.push(lessonId); else d.splice(i, 1);
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
