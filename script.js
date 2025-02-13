document.addEventListener("DOMContentLoaded", function() {
  // ================= LANGUAGE DICTIONARIES =================
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

  let currentLanguage = 'en';

  // Update UI text based on current language
  function updateLanguage() {
    const dict = languages[currentLanguage];
    document.getElementById('pageTitle').innerText = dict.pageTitle;
    document.getElementById('pageSubtitle').innerText = dict.pageSubtitle;
    document.getElementById('thSubject').innerText = dict.thSubject;
    document.getElementById('thCoefficient').innerText = dict.thCoefficient;
    document.getElementById('thExam').innerText = dict.thExam;
    document.getElementById('thCC').innerText = dict.thCC;
    document.getElementById('thTP').innerText = dict.thTP;
    document.getElementById('calcButton').innerText = dict.calcButton;
  }
  updateLanguage();

  // Language list event listeners
  document.querySelectorAll('.lang-item').forEach(item => {
    item.addEventListener('click', function() {
      currentLanguage = this.getAttribute('data-lang');
      updateLanguage();
    });
  });

  // ================= SUBJECTS DEFINITION =================
  const subjects = [
    { name: "Analysis", coefficient: 4, hasTP: false },
    { name: "Chemistry", coefficient: 3, hasTP: true },
    { name: "Computer Science", coefficient: 3, hasTP: false },
    { name: "English", coefficient: 1, hasTP: false },
    { name: "Fluid Mechanic", coefficient: 3, hasTP: true },
    { name: "French", coefficient: 1, hasTP: false },
    { name: "General Electric", coefficient: 3, hasTP: true },
    { name: "Engineering", coefficient: 3, hasTP: false },
    { name: "Numerical Analysis", coefficient: 2, hasTP: false },
    { name: "Physics", coefficient: 4, hasTP: true },
    { name: "Rational Mechanic", coefficient: 3, hasTP: false }
  ];

  const tbody = document.getElementById("subjectsTable");
  subjects.forEach((subject, index) => {
    const tr = document.createElement("tr");

    // Subject Name
    const tdName = document.createElement("td");
    tdName.innerText = subject.name;
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
      inputTP.addEventListener("input", updateStorage);
    } else {
      tdTP.innerText = "N/A";
    }
    tr.appendChild(tdTP);

    tbody.appendChild(tr);

    // Save exam & CC changes
    inputExam.addEventListener("input", updateStorage);
    inputCC.addEventListener("input", updateStorage);
  });

  // ================= LOCAL STORAGE =================
  function updateStorage() {
    let examValues = [];
    let ccValues = [];
    let tpValues = [];

    subjects.forEach((subject, index) => {
      const examVal = document.getElementById("exam_" + index).value;
      const ccVal = document.getElementById("cc_" + index).value;
      examValues.push(examVal);
      ccValues.push(ccVal);
      if (subject.hasTP) {
        const tpVal = document.getElementById("tp_" + index).value;
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
    let examValues = JSON.parse(localStorage.getItem("exam_scores") || "[]");
    let ccValues = JSON.parse(localStorage.getItem("cc_scores") || "[]");
    let tpValues = JSON.parse(localStorage.getItem("tp_scores") || "[]");

    subjects.forEach((subject, index) => {
      if (examValues[index] !== undefined) {
        document.getElementById("exam_" + index).value = examValues[index];
      }
      if (ccValues[index] !== undefined) {
        document.getElementById("cc_" + index).value = ccValues[index];
      }
      if (subject.hasTP && tpValues[index] !== undefined) {
        document.getElementById("tp_" + index).value = tpValues[index];
      }
    });
  }
  window.addEventListener("load", loadStorage);

  // ================= CALCULATE AVERAGES =================
  document.getElementById("calcButton").addEventListener("click", function() {
    let overallWeightedSum = 0;
    let totalCoefficients = 0;

    const resultsTitle = languages[currentLanguage].resultsTitle;
    const overallTitle = languages[currentLanguage].overallTitle;
    let resultsHtml = `<h3>${resultsTitle}</h3><ul>`;

    subjects.forEach((subject, index) => {
      const examScore = parseFloat(document.getElementById("exam_" + index).value) || 0;
      const ccScore = parseFloat(document.getElementById("cc_" + index).value) || 0;
      let average = 0;

      // Weighted average: exam=60%, cc=40% (or 60/20/20 if TP)
      if (subject.hasTP) {
        const tpScore = parseFloat(document.getElementById("tp_" + index).value) || 0;
        average = (examScore * 0.6) + (ccScore * 0.2) + (tpScore * 0.2);
      } else {
        average = (examScore * 0.6) + (ccScore * 0.4);
      }

      // Color-coded result
      const color = average >= 10 ? "green" : "red";
      resultsHtml += `<li>${subject.name}: <span style="color: ${color}">${average.toFixed(2)}</span></li>`;

      overallWeightedSum += average * subject.coefficient;
      totalCoefficients += subject.coefficient;
    });

    resultsHtml += "</ul>";

    // Overall average
    const overallAverage = overallWeightedSum / totalCoefficients;
    const overallColor = overallAverage >= 10 ? "green" : "red";
    resultsHtml += `<h3>${overallTitle} <span style="color: ${overallColor}">${overallAverage.toFixed(2)}</span></h3>`;

    document.getElementById("resultDiv").innerHTML = resultsHtml;
  });
});
