/* ==========================================
   1. FORMULARZ KONTAKTOWY
   ========================================== */
const form = document.querySelector("#contact-form");
if (form) {
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.querySelector("#email");
    const message = document.querySelector("#message");
    const status = document.querySelector("#form-status");
    if (!email || !message || !status) return;

    if (!email.validity.valid) {
      status.textContent = "Wpisz poprawny adres e-mail.";
      email.focus();
      return;
    }
    if (message.value.trim().length < 10) {
      status.textContent = "Wiadomość musi mieć co najmniej 10 znaków.";
      message.focus();
      return;
    }
    status.textContent =
      "Dziękujemy! Formularz został poprawnie wypełniony. To wersja demonstracyjna.";
    form.reset();
  });
}

/* ==============================================
   2. ZMIANA MOTYWU (działa na każdej podstronie)
   ============================================== */
function applyTheme(theme) {
  document.body.classList.toggle("light-theme", theme === "light");
  document.querySelectorAll(".theme-button").forEach(function (btn) {
    btn.textContent = theme === "light" ? "🌙 Ciemny motyw" : "☀ Jasny motyw";
  });
}

let savedTheme = "dark";
try {
  savedTheme = localStorage.getItem("theme") || "dark";
} catch (e) {}
applyTheme(savedTheme);

document.querySelectorAll(".theme-button").forEach(function (btn) {
  btn.addEventListener("click", function () {
    const next = document.body.classList.contains("light-theme")
      ? "dark"
      : "light";
    applyTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
  });
});

/* ==========================================
   3. SILNIK QUIZU (jedno pytanie na raz)
  ========================================== */
function runQuiz(box, questions, buildResult) {
  let i = 0,
    score = 0,
    locked = false;
  const points = {};

  function show() {
    const q = questions[i];
    locked = false;
    box.innerHTML =
      '<div class="progress"><span style="width:' +
      (i / questions.length) * 100 +
      '%"></span></div>' +
      '<p class="counter">Pytanie ' +
      (i + 1) +
      " z " +
      questions.length +
      "</p>" +
      "<h3></h3><div class='options'></div><div class='feedback'></div>" +
      '<button class="button next" type="button" hidden></button>';

    box.querySelector("h3").textContent = q.q;
    const opts = box.querySelector(".options");

    q.a.forEach(function (answer) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "option";
      b.textContent = answer.t;
      b.addEventListener("click", function () {
        pick(b, answer);
      });
      opts.append(b);
    });
  }

  function pick(btn, answer) {
    if (locked) return;
    locked = true;
    const q = questions[i];
    const buttons = box.querySelectorAll(".option");
    const feedback = box.querySelector(".feedback");

    buttons.forEach(function (b) {
      b.disabled = true;
    });

    if (
      q.a.some(function (a) {
        return "ok" in a;
      })
    ) {
      buttons.forEach(function (b, idx) {
        if (q.a[idx].ok) b.classList.add("correct");
      });
      if (answer.ok) {
        score++;
        feedback.textContent = "✨ Dobrze! " + (q.info || "");
      } else {
        btn.classList.add("wrong");
        feedback.textContent = "✗ Niestety nie. " + (q.info || "");
      }
    } else {
      btn.classList.add("chosen");
      points[answer.h] = (points[answer.h] || 0) + 1;
    }

    const next = box.querySelector(".next");
    next.hidden = false;
    next.textContent = i === questions.length - 1 ? "Zobacz wynik" : "Dalej →";
    next.addEventListener("click", function () {
      i++;
      i < questions.length ? show() : finish();
    });
  }

  function finish() {
    box.innerHTML =
      '<div class="progress"><span style="width:100%"></span></div>' +
      '<div class="quiz-end">' +
      buildResult(score, points, questions.length) +
      "</div>" +
      '<div style="text-align:center"><button class="button restart" type="button">Zacznij od nowa</button></div>';
    box.querySelector(".restart").addEventListener("click", function () {
      i = 0;
      score = 0;
      Object.keys(points).forEach(function (k) {
        delete points[k];
      });
      show();
    });
  }

  show();
}

/* ==========================================
        4. TIARA PRZYDZIAŁU 
   ========================================== */
const sortingBox = document.querySelector("#sorting-quiz");
if (sortingBox) {
  const houseInfo = {
    g: ["Gryffindor 🦁", "Odważny i szlachetny — jak Harry, Hermiona i Ron."],
    s: [
      "Slytherin 🐍",
      "Ambitny i sprytny — wiesz, czego chcesz i potrafisz to zdobyć.",
    ],
    r: [
      "Ravenclaw 🦅",
      "Ciekawy świata i mądry — wiedza jest Twoją największą siłą.",
    ],
    h: ["Hufflepuff 🦡", "Lojalny i uczciwy — każdy może na Tobie polegać."],
  };

  const sortingQuestions = [
    {
      q: "Co cenisz u siebie najbardziej?",
      a: [
        { t: "Odwagę", h: "g" },
        { t: "Ambicję", h: "s" },
        { t: "Wiedzę", h: "r" },
        { t: "Lojalność", h: "h" },
      ],
    },
    {
      q: "Wolny wieczór w Hogwarcie. Co robisz?",
      a: [
        { t: "Wyprawa do Zakazanego Lasu", h: "g" },
        { t: "Planuję, jak zdobyć Puchar Domów", h: "s" },
        { t: "Czytam w bibliotece", h: "r" },
        { t: "Kolacja z przyjaciółmi w Wielkiej Sali", h: "h" },
      ],
    },
    {
      q: "Który przedmiot lubisz najbardziej?",
      a: [
        { t: "Obrona przed czarną magią", h: "g" },
        { t: "Eliksiry", h: "s" },
        { t: "Zaklęcia", h: "r" },
        { t: "Zielarstwo", h: "h" },
      ],
    },
    {
      q: "Przyjaciel ma kłopoty. Co robisz?",
      a: [
        { t: "Od razu ruszam na pomoc", h: "g" },
        { t: "Wymyślam sprytny plan", h: "s" },
        { t: "Szukam rozwiązania w książkach", h: "r" },
        { t: "Jestem przy nim, cokolwiek się stanie", h: "h" },
      ],
    },
  ];

  runQuiz(sortingBox, sortingQuestions, function (score, points) {
    let best = "g";
    Object.keys(points).forEach(function (k) {
      if (points[k] > points[best] || !points[best]) best = k;
    });
    return (
      "<p>Tiara Przydziału wybrała dla Ciebie:</p><div class='big'>" +
      houseInfo[best][0] +
      "</div><p>" +
      houseInfo[best][1] +
      "</p>"
    );
  });
}

/* ==========================================
       5. QUIZ WIEDZY
   ========================================== */
const quizBox = document.querySelector("#quiz");
if (quizBox) {
  const quizQuestions = [
    {
      q: "Jak nazywa się szkoła magii, do której chodzi Harry?",
      info: "To Hogwart!",
      a: [
        { t: "Beauxbatons", ok: false },
        { t: "Hogwart", ok: true },
        { t: "Durmstrang", ok: false },
      ],
    },
    {
      q: "Kto jest najlepszym przyjacielem Harry’ego?",
      info: "Ron Weasley poznał Harry’ego w Hogwart Expressie.",
      a: [
        { t: "Draco Malfoy", ok: false },
        { t: "Neville Longbottom", ok: false },
        { t: "Ron Weasley", ok: true },
      ],
    },
    {
      q: "Ile piłek jest używanych w Quidditchu?",
      info: "Kafel, dwa tłuczki i złoty znicz.",
      a: [
        { t: "2", ok: false },
        { t: "3", ok: false },
        { t: "4", ok: true },
        { t: "5", ok: false },
      ],
    },
    {
      q: "Do którego domu należał Harry Potter?",
      info: "Gryffindor — dom odważnych.",
      a: [
        { t: "Gryffindor", ok: true },
        { t: "Slytherin", ok: false },
        { t: "Ravenclaw", ok: false },
      ],
    },
    {
      q: "Jak ma na imię sowa Harry’ego?",
      info: "Hedwiga była prezentem od Hagrida.",
      a: [
        { t: "Errol", ok: false },
        { t: "Hedwiga", ok: true },
        { t: "Parszywek", ok: false },
      ],
    },
    {
      q: "Które zaklęcie służy do rozbrajania przeciwnika?",
      info: "Expelliarmus to ulubione zaklęcie Harry’ego.",
      a: [
        { t: "Lumos", ok: false },
        { t: "Accio", ok: false },
        { t: "Expelliarmus", ok: true },
      ],
    },
    {
      q: "Kto jest dyrektorem Hogwartu w pierwszej części?",
      info: "Albus Dumbledore.",
      a: [
        { t: "Severus Snape", ok: false },
        { t: "Albus Dumbledore", ok: true },
        { t: "Minerwa McGonagall", ok: false },
      ],
    },
    {
      q: "Z którego peronu odjeżdża Hogwart Express?",
      info: "Z peronu 9¾ na dworcu King’s Cross.",
      a: [
        { t: "Peron 9¾", ok: true },
        { t: "Peron 7", ok: false },
        { t: "Peron 13", ok: false },
      ],
    },
  ];

  runQuiz(quizBox, quizQuestions, function (score, points, total) {
    const msg =
      score === total
        ? "Świetnie! Jesteś prawdziwym znawcą magii! 🏆"
        : score >= total / 2
          ? "Dobra robota! Znasz całkiem dobrze świat magii."
          : "Spróbuj jeszcze raz i poznaj lepiej Hogwart!";
    return (
      "<p>Twój wynik:</p><div class='big'>" +
      score +
      " / " +
      total +
      "</div><p>" +
      msg +
      "</p>"
    );
  });
}

/* ==========================================
     6. LOSOWE CYTATY
   ========================================== */
const quoteButton = document.querySelector("#quote-button");
const quoteElement = document.querySelector("#quote");
if (quoteButton && quoteElement) {
  const quotes = [
    "To nasze wybory pokazują, kim naprawdę jesteśmy.",
    "Szczęście można znaleźć nawet w najciemniejszych czasach.",
    "Nie warto żyć marzeniami i zapominać o prawdziwym życiu.",
    "Różnica między dobrem a złem jest czasami bardzo cienka.",
  ];
  quoteButton.addEventListener("click", function () {
    quoteElement.textContent =
      "„" + quotes[Math.floor(Math.random() * quotes.length)] + "”";
  });
}

/* ==========================================
     7. ZEGAR
   ========================================== */
const clock = document.querySelector("#clock");
function updateClock() {
  if (clock) clock.textContent = new Date().toLocaleTimeString("pl-PL");
}
if (clock) {
  updateClock();
  setInterval(updateClock, 1000);
}

/* ==========================================
    8. GALERIA: filtry, polubienia, lightbox
   ========================================== */
const gallery = document.querySelector(".gallery");
if (gallery) {
  const items = Array.from(gallery.querySelectorAll(".g-item"));

  /*Filtry */
  document.querySelectorAll(".filter-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".filter-btn").forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");
      const f = btn.dataset.filter;
      items.forEach(function (item) {
        item.hidden = !(f === "all" || item.dataset.category === f);
      });
    });
  });

  /* Polubienia (zapis w localStorage) */
  let likes = {};
  try {
    likes = JSON.parse(localStorage.getItem("likes")) || {};
  } catch (e) {}

  items.forEach(function (item) {
    const btn = item.querySelector(".like-btn");
    const count = btn.querySelector("span");
    const id = item.dataset.id;
    function render() {
      count.textContent = likes[id] || 0;
      btn.classList.toggle("liked", (likes[id] || 0) > 0);
    }
    render();
    btn.addEventListener("click", function () {
      likes[id] = (likes[id] || 0) + 1;
      try {
        localStorage.setItem("likes", JSON.stringify(likes));
      } catch (e) {}
      render();
    });
  });

  /*  Lightbox */
  const box = document.createElement("div");
  box.className = "lightbox";
  box.hidden = true;
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.innerHTML =
    '<button class="lb-btn lb-close" type="button" aria-label="Zamknij">×</button>' +
    '<button class="lb-btn lb-prev" type="button" aria-label="Poprzednie">‹</button>' +
    '<img alt="" />' +
    '<div class="lb-info"><strong></strong><span></span><br /><small></small></div>' +
    '<button class="lb-btn lb-next" type="button" aria-label="Następne">›</button>';
  document.body.append(box);

  const lbImg = box.querySelector("img");
  const lbTitle = box.querySelector("strong");
  const lbDesc = box.querySelector(".lb-info span");
  const lbCount = box.querySelector("small");
  let current = 0;

  function visibleItems() {
    return items.filter(function (it) {
      return !it.hidden;
    });
  }

  function showAt(index) {
    const list = visibleItems();
    if (!list.length) return;
    current = (index + list.length) % list.length;
    const item = list[current];
    lbImg.src = item.querySelector("img").src;
    lbImg.alt = item.querySelector("img").alt;
    lbTitle.textContent = item.querySelector(".g-title").textContent;
    lbDesc.textContent = item.dataset.desc;
    lbCount.textContent = current + 1 + " / " + list.length;
  }

  function openBox(item) {
    box.hidden = false;
    document.body.style.overflow = "hidden";
    showAt(visibleItems().indexOf(item));
  }

  function closeBox() {
    box.hidden = true;
    document.body.style.overflow = "";
  }

  items.forEach(function (item) {
    item.querySelector("img").addEventListener("click", function () {
      openBox(item);
    });
  });

  box.querySelector(".lb-close").addEventListener("click", closeBox);
  box.querySelector(".lb-prev").addEventListener("click", function () {
    showAt(current - 1);
  });
  box.querySelector(".lb-next").addEventListener("click", function () {
    showAt(current + 1);
  });
  box.addEventListener("click", function (e) {
    if (e.target === box) closeBox();
  });

  document.addEventListener("keydown", function (e) {
    if (box.hidden) return;
    if (e.key === "Escape") closeBox();
    if (e.key === "ArrowLeft") showAt(current - 1);
    if (e.key === "ArrowRight") showAt(current + 1);
  });
}
