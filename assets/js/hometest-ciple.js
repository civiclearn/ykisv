// ----------------------------
// SETTINGS
// ----------------------------
const QUESTIONS_PER_ROW = 3;

// ----------------------------
// FULL QUESTION POOL — CIPLE (Portuguese A2, "hard A2")
// Prepositions, idioms, ser/estar, por/para, pronoun placement,
// false friends, irregular verbs, subjunctive triggers, articles
// ----------------------------
const INLINE_TEST_QUESTIONS = [
  {
    q: "Ele está sempre a meter água. O que significa esta expressão?",
    a: [
      "Está sempre a cometer erros",
      "Está sempre a beber água",
      "Está sempre a tomar banho"
    ],
    correct: 0
  },
  {
    q: "Qual é a forma correta? «Eu _____ em Lisboa há três anos.»",
    a: [
      "vivo",
      "estou vivendo",
      "tenho vivido"
    ],
    correct: 0
  },
  {
    q: "«Ela deu-me o livro _____ eu pudesse estudar.» Qual é a preposição correta?",
    a: [
      "para que",
      "por que",
      "de que"
    ],
    correct: 0
  },
  {
    q: "Qual é a frase correta?",
    a: [
      "Não me digas isso!",
      "Não digas-me isso!",
      "Me não digas isso!"
    ],
    correct: 0
  },
  {
    q: "«A Maria é muito _____ .» Ela nunca gasta dinheiro sem necessidade.",
    a: [
      "poupada",
      "económica",
      "barata"
    ],
    correct: 0
  },
  {
    q: "Qual é a diferença? «O João é doente» vs. «O João está doente».",
    a: [
      "«É doente» = condição crónica; «está doente» = temporário",
      "São iguais, não há diferença",
      "«É doente» = temporário; «está doente» = crónica"
    ],
    correct: 0
  },
  {
    q: "Complete: «Vou _____ correios enviar uma carta.»",
    a: [
      "aos",
      "nos",
      "pelos"
    ],
    correct: 0
  },
  {
    q: "O que significa «ficar com os azeites»?",
    a: [
      "Ficar zangado ou ofendido",
      "Ficar com as azeitonas",
      "Ficar com óleo na roupa"
    ],
    correct: 0
  },
  {
    q: "Escolha a forma correta do verbo: «Quando eu _____ a Lisboa, visito-te.»",
    a: [
      "for",
      "vou",
      "irei"
    ],
    correct: 0
  },
  {
    q: "«Ela passou a noite em claro.» O que significa?",
    a: [
      "Não dormiu a noite toda",
      "Dormiu com a luz acesa",
      "Teve uma noite tranquila"
    ],
    correct: 0
  },
  {
    q: "Qual é a preposição correta? «Estou farto _____ esperar.»",
    a: [
      "de",
      "por",
      "em"
    ],
    correct: 0
  },
  {
    q: "«O meu filho é um _____ de sete ofícios.» Complete o provérbio.",
    a: [
      "pau",
      "homem",
      "mestre"
    ],
    correct: 0
  },
  {
    q: "Qual é a forma correta? «Se eu _____ dinheiro, comprava um carro.»",
    a: [
      "tivesse",
      "tenho",
      "teria"
    ],
    correct: 0
  },
  {
    q: "«Constipação» em português europeu significa:",
    a: [
      "Resfriado / gripe ligeira",
      "Prisão de ventre",
      "Alergia"
    ],
    correct: 0
  },
  {
    q: "Qual é o plural correto de «cidadão»?",
    a: [
      "cidadãos",
      "cidadães",
      "cidadãoes"
    ],
    correct: 0
  },
  {
    q: "Complete: «Não saio de casa _____ chova.»",
    a: [
      "quando",
      "se",
      "porque"
    ],
    correct: 0
  },
  {
    q: "«Ele tem muita lata!» O que significa?",
    a: [
      "Tem muito descaramento",
      "Tem muitas latas de conserva",
      "Tem muito dinheiro"
    ],
    correct: 0
  },
  {
    q: "Qual é a frase correta com o pronome?",
    a: [
      "O professor deu-lhes os testes.",
      "O professor deu-los os testes.",
      "O professor lhes deu os testes."
    ],
    correct: 0
  },
  {
    q: "«Estou _____ azeite.» = Estou sem dinheiro. Qual é a preposição?",
    a: [
      "sem",
      "no",
      "com"
    ],
    correct: 0
  },
  {
    q: "Qual é a conjugação correta? «É provável que ele _____ amanhã.»",
    a: [
      "venha",
      "vem",
      "virá"
    ],
    correct: 0
  }
];

// ----------------------------
// STATE
// ----------------------------
let correctCount = 0;
let wrongCount = 0;
let answeredCount = 0;
let totalQuestions = INLINE_TEST_QUESTIONS.length;

let currentRow = 0;

// ----------------------------
// UI TARGETS
// ----------------------------
const container = document.getElementById("inline-test-questions");

// ----------------------------
// PROGRESS DISPLAY
// ----------------------------
function updateProgressDisplay() {
  document.getElementById("inline-progress-text").textContent =
    `Progresso: ${answeredCount} / ${totalQuestions} questões`;
}

function updateProgressBar() {
  const pct = (answeredCount / totalQuestions) * 100;
  document.getElementById("inline-progressbar").style.width = pct + "%";
}

// ----------------------------
// UTILITIES
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

  question.a = combined.map(i => i.text);
  question.correct = combined.findIndex(i => i.isCorrect);
}

function createDonutChart() {
  const pct = Math.round((correctCount / totalQuestions) * 100);
  const C = 2 * Math.PI * 40;

  return `
    <div class="donut-wrapper">
      <svg width="120" height="120" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" stroke="#ebe6ff" stroke-width="12" fill="none"></circle>
        <circle cx="50" cy="50" r="40" stroke="#6d4aff" stroke-width="12" fill="none"
          stroke-dasharray="${(pct / 100) * C} ${(1 - pct / 100) * C}"
          transform="rotate(-90 50 50)" stroke-linecap="round"></circle>
      </svg>
      <div class="donut-center">${pct}%</div>
    </div>
  `;
}

function createEndCard() {
  const pct = Math.round((correctCount / totalQuestions) * 100);
  const card = document.createElement("div");
  card.className = "inline-question-card end-card";

  const title =
    pct >= 80 ? "Excelente trabalho!" :
    pct >= 50 ? "Muito bem!" :
    pct >= 25 ? "Bom começo!" :
    "Continue a treinar";

  card.innerHTML = `
    <h3>${title}</h3>
    ${createDonutChart()}
    <p>Terminou as questões de exemplo gratuitas.
    Obtenha acesso a <strong>todos os simulados e exercícios</strong>, com explicações detalhadas.</p>
    <a href="https://civiclearn.com/ciple/checkout.html" class="hero-primary-btn">Acesso completo</a>
  `;

  return card;
}

// ----------------------------
// BUILD ROWS
// ----------------------------
const rows = [];
for (let i = 0; i < totalQuestions; i += QUESTIONS_PER_ROW) {
  rows.push(INLINE_TEST_QUESTIONS.slice(i, i + QUESTIONS_PER_ROW));
}

INLINE_TEST_QUESTIONS.forEach(q => shuffleAnswers(q));

// ----------------------------
// RENDERING
// ----------------------------
function renderRow(rowIndex) {
  if (!rows[rowIndex]) return;

  rows[rowIndex].forEach((q, offset) => {
    const absoluteIndex = rowIndex * QUESTIONS_PER_ROW + offset;
    container.appendChild(createQuestionCard(q, absoluteIndex));
  });
}

function createQuestionCard(questionObj, absoluteIndex) {
  const card = document.createElement("div");
  card.className = "inline-question-card";

  const title = document.createElement("h3");
  title.textContent = questionObj.q;

  const feedback = document.createElement("div");
  feedback.className = "inline-feedback";

  card.append(title);

  questionObj.a.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "inline-option-btn";
    btn.textContent = opt;

    btn.onclick = () => {
      answeredCount++;
      updateProgressDisplay();
      updateProgressBar();

      // Disable all buttons first
      card.querySelectorAll("button").forEach(b => (b.disabled = true));

      if (i === questionObj.correct) {
        correctCount++;
        btn.style.background = "rgba(24, 160, 110, 0.15)";
        btn.style.borderColor = "#18a06e";
        btn.style.color = "#14805a";
        feedback.textContent = "Correto!";
        feedback.classList.add("inline-correct");
      } else {
        wrongCount++;
        btn.style.background = "rgba(230, 57, 70, 0.12)";
        btn.style.borderColor = "#e63946";
        btn.style.color = "#c5303b";
        // Highlight the correct answer in green
        const allBtns = card.querySelectorAll("button");
        allBtns[questionObj.correct].style.background = "rgba(24, 160, 110, 0.15)";
        allBtns[questionObj.correct].style.borderColor = "#18a06e";
        allBtns[questionObj.correct].style.color = "#14805a";
        feedback.textContent =
          "Resposta correta: " + questionObj.a[questionObj.correct];
        feedback.classList.add("inline-wrong");
      }

      card.appendChild(feedback);

      const isLastQuestion = absoluteIndex === totalQuestions - 1;

      if (isLastQuestion) {
        setTimeout(() => container.appendChild(createEndCard()), 300);
      }

      const isLastInRow =
        (absoluteIndex + 1) % QUESTIONS_PER_ROW === 0 &&
        absoluteIndex !== totalQuestions - 1;

      if (isLastInRow) {
        currentRow++;
        renderRow(currentRow);
      }
    };

    card.appendChild(btn);
  });

  return card;
}

// ----------------------------
// INITIAL RENDER
// ----------------------------
renderRow(0);
updateProgressDisplay();
updateProgressBar();
