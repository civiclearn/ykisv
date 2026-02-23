// ----------------------------
// SETTINGS
// ----------------------------
const QUESTIONS_PER_ROW = 3;

// ----------------------------
// FULL QUESTION POOL – YKI Svenska (B1, with some B2 overflow)
// Grammar: adjective agreement, verb forms, prepositions, pronouns,
// word order, particles, idioms, false friends
// ----------------------------
const INLINE_TEST_QUESTIONS = [
  {
    q: "Välj rätt form: «Det är ett _____ hus.»",
    a: [
      "gammalt",
      "gammal",
      "gamla"
    ],
    correct: 0
  },
  {
    q: "«Han är väldigt bra _____ att laga mat.» Vilken preposition är korrekt?",
    a: [
      "på",
      "i",
      "med"
    ],
    correct: 0
  },
  {
    q: "Vilket ord saknas? «Jag har aldrig _____ Sverige förut.»",
    a: [
      "besökt",
      "besöka",
      "besöker"
    ],
    correct: 0
  },
  {
    q: "Vad betyder uttrycket «att ha is i magen»?",
    a: [
      "Att vara lugn och tålmodig",
      "Att ha ont i magen",
      "Att vara kall och oberörd av allt"
    ],
    correct: 0
  },
  {
    q: "Välj rätt ordföljd: «Igår _____»",
    a: [
      "åt vi middag hemma",
      "vi åt middag hemma",
      "vi middag hemma åt"
    ],
    correct: 0
  },
  {
    q: "«Hon jobbar _____ måndag _____ fredag.» Vilka prepositioner passar?",
    a: [
      "från / till",
      "av / till",
      "på / till"
    ],
    correct: 0
  },
  {
    q: "Vilket alternativ är korrekt? «Det är viktigt att du _____ i tid.»",
    a: [
      "kommer",
      "komma",
      "kom"
    ],
    correct: 0
  },
  {
    q: "Vad är den korrekta pluralformen av «en bok»?",
    a: [
      "böcker",
      "boken",
      "bokar"
    ],
    correct: 0
  },
  {
    q: "Vad betyder «att slå två flugor i en smäll»?",
    a: [
      "Att lösa två problem på en gång",
      "Att göra något väldigt snabbt",
      "Att slåss med någon"
    ],
    correct: 0
  },
  {
    q: "«De hade redan _____ när vi kom.» Välj rätt verbform.",
    a: [
      "gått",
      "gick",
      "går"
    ],
    correct: 0
  },
  {
    q: "«Huset _____ av en känd arkitekt.» Välj rätt passivform.",
    a: [
      "ritades",
      "ritade",
      "ritar"
    ],
    correct: 0
  },
  {
    q: "«Gift» på svenska kan betyda:",
    a: [
      "Både 'gift' (married) och 'poison'",
      "Bara 'gift' (present på engelska)",
      "Bara 'married'"
    ],
    correct: 0
  },
  {
    q: "«Kan du hjälpa _____ med det här?» Välj rätt pronomen.",
    a: [
      "mig",
      "jag",
      "min"
    ],
    correct: 0
  },
  {
    q: "Vilket ord passar? «Han var så trött att han _____ somna på bussen.»",
    a: [
      "nästan",
      "ändå",
      "sällan"
    ],
    correct: 0
  },
  {
    q: "«_____ du hinner, ta gärna med lite bröd.» Välj rätt konjunktion.",
    a: [
      "Om",
      "Att",
      "Därför"
    ],
    correct: 0
  },
  {
    q: "Vad är rätt genitivform? «Det är _____ cykel.»",
    a: [
      "Annas",
      "Anna's",
      "Annas'"
    ],
    correct: 0
  },
  {
    q: "Vad betyder «att gå som katten kring het gröt»?",
    a: [
      "Att undvika att ta upp ett känsligt ämne direkt",
      "Att röra sig väldigt försiktigt",
      "Att vara väldigt hungrig"
    ],
    correct: 0
  },
  {
    q: "Vilket alternativ har FEL ordföljd i bisatsen?",
    a: [
      "«Jag vet att han äter alltid frukost.»",
      "«Jag vet att han alltid äter frukost.»",
      "«Hon frågade om de alltid åkte buss.»"
    ],
    correct: 0
  },
  {
    q: "«Jag är _____ av att vänta.» Välj det alternativ som INTE fungerar.",
    a: [
      "glad",
      "trött",
      "less"
    ],
    correct: 0
  },
  {
    q: "«Det spelar ingen _____ vad hon tycker.» Välj rätt ord.",
    a: [
      "roll",
      "del",
      "vikt"
    ],
    correct: 0
  }
];

// ----------------------------
// SHUFFLE — runs before DOM logic
// ----------------------------
function shuffleAnswers(question) {
  const combined = question.a.map((opt, index) => ({
    text: opt,
    isCorrect: index === question.correct
  }));
  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }
  question.a = combined.map(item => item.text);
  question.correct = combined.findIndex(item => item.isCorrect);
}

INLINE_TEST_QUESTIONS.forEach(q => shuffleAnswers(q));

// ----------------------------
// BUILD ROWS (after shuffle so object references are stable)
// ----------------------------
const rows = [];
for (let i = 0; i < INLINE_TEST_QUESTIONS.length; i += QUESTIONS_PER_ROW) {
  rows.push(INLINE_TEST_QUESTIONS.slice(i, i + QUESTIONS_PER_ROW));
}

// ----------------------------
// ALL DOM LOGIC INSIDE DOMContentLoaded
// Prevents null-reference when script is not at bottom of <body>
// ----------------------------
document.addEventListener("DOMContentLoaded", function () {

  const totalQuestions    = INLINE_TEST_QUESTIONS.length;
  let correctCount        = 0;
  let wrongCount          = 0;
  let answeredCount       = 0;
  let currentRow          = 0;

  // Per-row answered counts — drives row-reveal reliably regardless of answer order
  const rowAnsweredCounts = new Array(rows.length).fill(0);

  const container = document.getElementById("inline-test-questions");
  if (!container) {
    console.error("hometest-ykisvenska: #inline-test-questions not found in DOM.");
    return;
  }

  // ----------------------------
  // PROGRESS
  // ----------------------------
  function updateProgressDisplay() {
    const el = document.getElementById("inline-progress-text");
    if (el) el.textContent = "Framsteg: " + answeredCount + " / " + totalQuestions + " frågor";
  }

  function updateProgressBar() {
    const bar = document.getElementById("inline-progressbar");
    if (bar) bar.style.width = ((answeredCount / totalQuestions) * 100) + "%";
  }

  // ----------------------------
  // END CARD
  // ----------------------------
  function createDonutChart() {
    const pct = Math.round((correctCount / totalQuestions) * 100);
    const C   = 2 * Math.PI * 40;
    return (
      '<div class="donut-wrapper">' +
        '<svg width="120" height="120" viewBox="0 0 100 100">' +
          '<circle cx="50" cy="50" r="40" stroke="#ebe6ff" stroke-width="12" fill="none"></circle>' +
          '<circle cx="50" cy="50" r="40" stroke="#6d4aff" stroke-width="12" fill="none"' +
            ' stroke-dasharray="' + ((pct / 100) * C) + ' ' + ((1 - pct / 100) * C) + '"' +
            ' transform="rotate(-90 50 50)" stroke-linecap="round"></circle>' +
        '</svg>' +
        '<div class="donut-center">' + pct + '%</div>' +
      '</div>'
    );
  }

  function createEndCard() {
    const pct  = Math.round((correctCount / totalQuestions) * 100);
    const card = document.createElement("div");
    card.className = "inline-question-card end-card";
    const title =
      pct >= 80 ? "Utmärkt jobbat!" :
      pct >= 50 ? "Bra gjort!" :
      pct >= 25 ? "Bra start!" :
      "Fortsätt träna!";
    card.innerHTML =
      "<h3>" + title + "</h3>" +
      createDonutChart() +
      "<p>Du har nu provat våra gratis exempelfrågor. " +
      "Få tillgång till <strong>alla övningar och provexamen</strong> med detaljerade förklaringar.</p>" +
      '<a href="https://civiclearn.com/yki-svenska/checkout.html" class="hero-primary-btn">Fullständig tillgång</a>';
    return card;
  }

  // ----------------------------
  // RENDER
  // ----------------------------
  function renderRow(rowIndex) {
    if (!rows[rowIndex]) return;
    rows[rowIndex].forEach(function (q, offset) {
      var absoluteIndex = rowIndex * QUESTIONS_PER_ROW + offset;
      container.appendChild(createQuestionCard(q, absoluteIndex, rowIndex));
    });
  }

  function createQuestionCard(questionObj, absoluteIndex, rowIndex) {
    var card = document.createElement("div");
    card.className = "inline-question-card";

    var title = document.createElement("h3");
    title.textContent = questionObj.q;
    card.appendChild(title);

    var feedback = document.createElement("div");
    feedback.className = "inline-feedback";

    questionObj.a.forEach(function (opt, i) {
      var btn = document.createElement("button");
      btn.className = "inline-option-btn";
      btn.textContent = opt;

      btn.onclick = function () {
        answeredCount++;
        rowAnsweredCounts[rowIndex]++;
        updateProgressDisplay();
        updateProgressBar();

        // Disable all buttons in this card immediately
        var allBtns = card.querySelectorAll("button");
        allBtns.forEach(function (b) { b.disabled = true; });

        if (i === questionObj.correct) {
          correctCount++;
          btn.style.background  = "rgba(24, 160, 110, 0.15)";
          btn.style.borderColor = "#18a06e";
          btn.style.color       = "#14805a";
          feedback.textContent  = "Rätt!";
          feedback.classList.add("inline-correct");
        } else {
          wrongCount++;
          btn.style.background  = "rgba(230, 57, 70, 0.12)";
          btn.style.borderColor = "#e63946";
          btn.style.color       = "#c5303b";
          // Highlight the correct answer
          allBtns[questionObj.correct].style.background  = "rgba(24, 160, 110, 0.15)";
          allBtns[questionObj.correct].style.borderColor = "#18a06e";
          allBtns[questionObj.correct].style.color       = "#14805a";
          feedback.textContent = "Rätt svar: " + questionObj.a[questionObj.correct];
          feedback.classList.add("inline-wrong");
        }

        card.appendChild(feedback);

        // Last question → show end card
        if (absoluteIndex === totalQuestions - 1) {
          setTimeout(function () { container.appendChild(createEndCard()); }, 300);
          return;
        }

        // All questions in this row answered → reveal next row
        var rowSize = rows[rowIndex].length;
        if (rowAnsweredCounts[rowIndex] === rowSize) {
          currentRow++;
          setTimeout(function () { renderRow(currentRow); }, 150);
        }
      };

      card.appendChild(btn);
    });

    return card;
  }

  // ----------------------------
  // INIT
  // ----------------------------
  renderRow(0);
  updateProgressDisplay();
  updateProgressBar();

}); // end DOMContentLoaded
