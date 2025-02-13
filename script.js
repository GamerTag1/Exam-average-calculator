document.addEventListener("DOMContentLoaded", function() {
  // ================= 1. UI LANGUAGE DICTIONARIES =================
  const languages = {
    en: {
      pageTitle: "Exam Average Calculator",
      pageSubtitle: "Calculate your exam average easily!",
      thSubject: "Subject",
      thCoefficient: "Coefficient",
      thExam: "Exam Score",
      thCC: "CC Score",
      thTP: "TP Score (if applicable)",
      calcButton: "Calculate Average",
      resultsTitle: "Subject Averages:",
      overallTitle: "Overall Average:"
    },
    fr: {
      pageTitle: "Calculateur de Moyenne d'Examen",
      pageSubtitle: "Calculez facilement votre moyenne d'examen !",
      thSubject: "Matière",
      thCoefficient: "Coefficient",
      thExam: "Note d'Examen",
      thCC: "Note de CC",
      thTP: "Note de TP (si applicable)",
      calcButton: "Calculer la Moyenne",
      resultsTitle: "Moyennes par Matière :",
      overallTitle: "Moyenne Générale :"
    },
    ar: {
      pageTitle: "حاسبة معدل الامتحان",
      pageSubtitle: "احسب معدلك بسهولة!",
      thSubject: "المادة",
      thCoefficient: "المعامل",
      thExam: "درجة الامتحان",
      thCC: "درجة التكوين",
      thTP: "درجة التدريب (إن وجد)",
      calcButton: "احسب المعدل",
      resultsTitle: "المعدلات حسب المادة:",
      overallTitle: "المعدل العام:"
    }
  };

  // ================= 2. SUBJECTS WITH MULTIPLE LANGUAGES =================
  // Each subject has translations for name in EN, FR, AR + coefficient + hasTP
  const subjects = [
    { en: "Analysis",       fr: "Analyse",        ar: "تحليل",    coefficient: 4, hasTP: false },
    { en: "Chemistry",      fr: "Chimie",         ar: "كيمياء",   coefficient: 3, hasTP: true  },
    { en: "Computer Science", fr: "Informatique", ar: "علوم الحاسوب", coefficient: 3, hasTP: false },
    { en: "English",        fr: "Anglais",        ar: "انجليزية", coefficient: 1, hasTP: false },
    { en: "Fluid Mechanic", fr: "Mécanique des Fluides", ar: "ميكانيك الموائع", coefficient: 3, hasTP: true },
    { en: "French",         fr: "Français",       ar: "فرنسية",   coefficient: 1, hasTP: false },
    { en: "General Electric", fr: "Électricité Générale", ar: "كهرباء عامة", coefficient: 3, hasTP: true },
    { en: "Engineering",    fr: "Génie",          ar: "هندسة",    coefficient: 3, hasTP: false },
    { en: "Numerical Analysis", fr: "Analyse Numérique", ar: "تحليل عددي", coefficient: 2, hasTP: false },
    { en: "Physics",        fr: "Physique",       ar: "فيزياء",   coefficient: 4, hasTP: true },
    { en: "Rational Mechanic", fr: "Mécanique Rationnelle", ar: "ميكانيك نظري", coefficient: 3, hasTP: false }
  ];

  let currentLanguage = 'en';

  // ================= 3. LANGUAGE SWITCHING FOR UI & SUBJECT NAMES =================
  function updateLanguage() {
    // 3A. Update Interface Text
    const dict = languages[currentLanguage];
    document.getElementById('pageTitle').innerText = dict.pageTitle;
    document.getElementById('pageSubtitle').innerText = dict.pageSubtitle;
    document.getElementById('thSubject').innerText = dict.thSubject;
    document.getElementById('thCoefficient').innerText = dict.thCoefficient;
    document.getElementById('thExam').innerText = dict.thExam;
    document.getElementById('thCC').innerText = dict.thCC;
    document.getElementById('thTP').innerText = dict.thTP;
    document.getElementById('calcButton').innerText = dict.calcButton;

    // 3B. Re-render subjects table with new language
    renderSubjects();
    // 3C. Reload stored input values (so we don't lose them)
    loadStorage();
  }

  // ================= 4. RENDER SUBJECTS TABLE DYNAMICALLY =================
  function renderSubjects() {
    const tbody = document.getElementById("subjectsTable");
    tbody.innerHTML = ""; // Clear old rows

    subjects.forEach((subject, index) => {
      const tr = document.createElement("tr");

      // Subject name in the current language
      const tdName = document.createElement("td");
      tdName.innerText = subject[currentLanguage];
      tr.appendChild(tdName);

      // Coefficient
      const tdCoef = document.createElement("td");
      tdCoef.innerText = subject.coefficient;
      tr.appendChild(tdCoef);

      // Exam Score Input
      const tdExam = document.createElement("td");
      const inputExam = document.createElement("input");
      inputExam.type = "number";
      inputExam.step = "0.01";
      inputExam.className = "form-control";
      inputExam.id = "exam_" + index;
      tdExam.appendChild(inputExam);
      tr.appendChild(tdExam);

      // CC Score Input
      const tdCC = document.createElement("td");
      const inputCC = document.createElement("input");
      inputCC.type = "number";
      inputCC.step = "0.01";
      inputCC.className = "form-control";
      inputCC.id = "cc_" + index;
      tdCC.appendChild(inputCC);
      tr.appendChild(tdCC);

      // TP Score Input (if applicable)
      const tdTP = document.createElement("td");
      if (subject.hasTP) {
        const inputTP = document.createElement("input");
        inputTP.type = "number";
        inputTP.step = "0.01";
        inputTP.className = "form-control";
        inputTP.id = "tp_" + index;
        tdTP.appendChild(inputTP);
        // Save changes to localStorage
        inputTP.addEventListener("input", updateStorage);
      } else {
        tdTP.innerText = "N/A";
      }
      tr.appendChild(tdTP);

      tbody.appendChild(tr);

      // Add listeners for exam & CC inputs
      inputExam.addEventListener("input", updateStorage);
      inputCC.addEventListener("input", updateStorage);
    });
  }

  // ================= 5. LOCAL STORAGE: SAVE & LOAD =================
  function updateStorage() {
    let examValues = [];
    let ccValues = [];
    let tpValues = [];

    subjects.forEach((subject, index) => {
      const examVal = document.getElementById("exam_" + index)?.value || "";
      const ccVal   = document.getElementById("cc_" + index)?.value || "";
      examValues.push(examVal);
      ccValues.push(ccVal);
      if (subject.hasTP) {
        const tpVal = document.getElementById("tp_" + index)?.value || "";
        tpValues.push(tpVal);
      } else {
        tpValues.push("");
      }
    });
    localStorage.setItem("exam_scores", JSON.stringify(examValues));
    localStorage.setItem("cc_scores", JSON.stringify(ccValues));
    localStorage.setItem("tp_scores", JSON.stringify(tpValues));
  }

  function loadStorage() {
    const examValues = JSON.parse(localStorage.getItem("exam_scores") || "[]");
    const ccValues   = JSON.parse(localStorage.getItem("cc_scores") || "[]");
    const tpValues   = JSON.parse(localStorage.getItem("tp_scores") || "[]");

    subjects.forEach((subject, index) => {
      const examField = document.getElementById("exam_" + index);
      const ccField   = document.getElementById("cc_" + index);
      const tpField   = document.getElementById("tp_" + index);

      if (examField && examValues[index] !== undefined) {
        examField.value = examValues[index];
      }
      if (ccField && ccValues[index] !== undefined) {
        ccField.value = ccValues[index];
      }
      if (tpField && tpValues[index] !== undefined) {
        tpField.value = tpValues[index];
      }
    });
  }

  // ================= 6. CALCULATE AVERAGES =================
  function calculateAverages() {
    let overallWeightedSum = 0;
    let totalCoefficients  = 0;

    // Build results
    const dict         = languages[currentLanguage];
    const resultsTitle = dict.resultsTitle;
    const overallTitle = dict.overallTitle;
    let resultsHtml    = `<h3>${resultsTitle}</h3><ul>`;

    subjects.forEach((subject, index) => {
      // Retrieve user input
      const examScore = parseFloat(document.getElementById("exam_" + index)?.value) || 0;
      const ccScore   = parseFloat(document.getElementById("cc_" + index)?.value)   || 0;
      let average     = 0;

      if (subject.hasTP) {
        const tpScore = parseFloat(document.getElementById("tp_" + index)?.value) || 0;
        average = (examScore * 0.6) + (ccScore * 0.2) + (tpScore * 0.2);
      } else {
        average = (examScore * 0.6) + (ccScore * 0.4);
      }

      // Color-coded
      const color = average >= 10 ? "green" : "red";
      resultsHtml += `<li>${subject[currentLanguage]}: <span style="color: ${color}">${average.toFixed(2)}</span></li>`;

      overallWeightedSum += average * subject.coefficient;
      totalCoefficients  += subject.coefficient;
    });

    resultsHtml += "</ul>";

    // Overall average
    const overallAverage = overallWeightedSum / totalCoefficients;
    const overallColor   = overallAverage >= 10 ? "green" : "red";
    resultsHtml += `<h3>${overallTitle} <span style="color: ${overallColor}">${overallAverage.toFixed(2)}</span></h3>`;

    document.getElementById("resultDiv").innerHTML = resultsHtml;
  }

  // ================= 7. RESET FUNCTION =================
  function resetCalculator() {
    // 7A. Clear all inputs
    subjects.forEach((subject, index) => {
      const examField = document.getElementById("exam_" + index);
      const ccField   = document.getElementById("cc_" + index);
      const tpField   = document.getElementById("tp_" + index);

      if (examField) examField.value = "";
      if (ccField)   ccField.value   = "";
      if (tpField)   tpField.value   = "";
    });

    // 7B. Clear localStorage
    localStorage.removeItem("exam_scores");
    localStorage.removeItem("cc_scores");
    localStorage.removeItem("tp_scores");

    // 7C. Clear results
    document.getElementById("resultDiv").innerHTML = "";
  }

  // ================= 8. INITIALIZE EVERYTHING =================
  // Render the table for the first time
  renderSubjects();
  // Load stored values
  loadStorage();

  // Hook up the calculation button
  document.getElementById("calcButton").addEventListener("click", calculateAverages);

  // Hook up language switching
  document.querySelectorAll('.lang-item').forEach(item => {
    item.addEventListener('click', function() {
      currentLanguage = this.getAttribute('data-lang');
      updateLanguage();
    });
  });

  // Hook up the RESET button
  document.getElementById("resetButton").addEventListener("click", resetCalculator);
});
