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
      thTP: "TP Score ",
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
      thTP: "Note de TP ",
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
      thTP: " درجة التدريب ",
      calcButton: "احسب المعدل",
      resultsTitle: "المعدلات حسب المادة:",
      overallTitle: "المعدل العام:"
    }
  };

  // Error messages for scores over 20
  const examErrorMessages = {
    en: "Exam score over limit (max 20)",
    fr: "Note d'Examen hors limite (max 20)",
    ar: "درجة الامتحان فوق الحد (20 كحد أقصى)"
  };
  const ccErrorMessages = {
    en: "CC score over limit (max 20)",
    fr: "Note de CC hors limite (max 20)",
    ar: "درجة التكوين فوق الحد (20 كحد أقصى)"
  };
  const tpErrorMessages = {
    en: "TP score over limit (max 20)",
    fr: "Note de TP hors limite (max 20)",
    ar: "درجة التدريب فوق الحد (20 كحد أقصى)"
  };

  // ================= 2. SUBJECTS WITH MULTIPLE LANGUAGES =================
  // Default S3 preset: Analysis=4, Numerical Analysis=2.
  // (S4 preset: Analysis=3, Numerical Analysis=3 will be applied when the S4 button is pressed.)
  let subjects = [
    { en: "Analysis",       fr: "Analyse",              ar: "تحليل",         coefficient: 4, hasTP: false },
    { en: "Chemistry",      fr: "Chimie",               ar: "كيمياء",        coefficient: 3, hasTP: true  },
    { en: "Computer Science", fr: "Informatique",      ar: "علوم الحاسوب",   coefficient: 3, hasTP: false },
    { en: "English",        fr: "Anglais",              ar: "انجليزية",       coefficient: 1, hasTP: false },
    { en: "Fluid Mechanic", fr: "Mécanique des Fluides", ar: "ميكانيك الموائع", coefficient: 3, hasTP: true  },
    { en: "French",         fr: "Français",             ar: "فرنسية",        coefficient: 1, hasTP: false },
    { en: "General Electric", fr: "Électricité Générale", ar: "كهرباء عامة",   coefficient: 3, hasTP: true  },
    { en: "Engineering",    fr: "Génie",                ar: "هندسة",         coefficient: 3, hasTP: false },
    { en: "Numerical Analysis", fr: "Analyse Numérique", ar: "تحليل عددي",    coefficient: 2, hasTP: false },
    { en: "Physics",        fr: "Physique",             ar: "فيزياء",        coefficient: 4, hasTP: true  },
    { en: "Rational Mechanic", fr: "Mécanique Rationnelle", ar: "ميكانيك نظري", coefficient: 3, hasTP: false }
  ];

  let currentLanguage = "en";

  // ================= 3. LANGUAGE SWITCHING =================
  function updateLanguage() {
    const dict = languages[currentLanguage];
    document.getElementById("pageTitle").innerText    = dict.pageTitle;
    document.getElementById("pageSubtitle").innerText = dict.pageSubtitle;
    document.getElementById("thSubject").innerText    = dict.thSubject;
    document.getElementById("thCoefficient").innerText= dict.thCoefficient;
    document.getElementById("thExam").innerText       = dict.thExam;
    document.getElementById("thCC").innerText         = dict.thCC;
    document.getElementById("thTP").innerText         = dict.thTP;
    document.getElementById("calcButton").innerText   = dict.calcButton;
    renderSubjects();
    loadStorage();
    updateCCErrorMessages();
  }
  updateLanguage();

  document.querySelectorAll(".lang-item").forEach(item => {
    item.addEventListener("click", function() {
      currentLanguage = this.getAttribute("data-lang");
      updateLanguage();
    });
  });

  // ================= 4. RENDER SUBJECTS TABLE DYNAMICALLY =================
  function renderSubjects() {
    const tbody = document.getElementById("subjectsTable");
    tbody.innerHTML = "";
    subjects.forEach((subject, index) => {
      const tr = document.createElement("tr");

      // Subject name in current language
      const tdName = document.createElement("td");
      tdName.innerText = subject[currentLanguage];
      tr.appendChild(tdName);

      // Coefficient (read-only)
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

      // CC Score Input with error message span
      const tdCC = document.createElement("td");
      const inputCC = document.createElement("input");
      inputCC.type = "number";
      inputCC.step = "0.01";
      inputCC.className = "form-control";
      inputCC.id = "cc_" + index;
      tdCC.appendChild(inputCC);
      const errorSpan = document.createElement("span");
      errorSpan.id = "cc_error_" + index;
      errorSpan.className = "cc-error";
      tdCC.appendChild(errorSpan);
      tr.appendChild(tdCC);

      // TP Score Input (if applicable) with error message span
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

      inputExam.addEventListener("input", function() {
        updateStorage();
        checkExam(inputExam, index);
      });
      inputCC.addEventListener("input", function() {
        updateStorage();
        checkCC(inputCC, index);
      });
    });
  }

  // ================= 5. LOCAL STORAGE: SAVE & LOAD =================
  function updateStorage() {
    let examValues = [];
    let ccValues = [];
    let tpValues = [];
    let coefValues = [];
    subjects.forEach((subject, index) => {
      const examField = document.getElementById("exam_" + index);
      const ccField = document.getElementById("cc_" + index);
      examValues.push(examField ? examField.value : "");
      ccValues.push(ccField ? ccField.value : "");
      if (subject.hasTP) {
        const tpField = document.getElementById("tp_" + index);
        tpValues.push(tpField ? tpField.value : "");
      } else {
        tpValues.push("");
      }
      coefValues.push(subject.coefficient);
    });
    localStorage.setItem("exam_scores", JSON.stringify(examValues));
    localStorage.setItem("cc_scores", JSON.stringify(ccValues));
    localStorage.setItem("tp_scores", JSON.stringify(tpValues));
    localStorage.setItem("coef_scores", JSON.stringify(coefValues));
  }

  function loadStorage() {
    const examValues = JSON.parse(localStorage.getItem("exam_scores") || "[]");
    const ccValues = JSON.parse(localStorage.getItem("cc_scores") || "[]");
    const tpValues = JSON.parse(localStorage.getItem("tp_scores") || "[]");
    const coefValues = JSON.parse(localStorage.getItem("coef_scores") || "[]");
    subjects.forEach((subject, index) => {
      const examField = document.getElementById("exam_" + index);
      const ccField = document.getElementById("cc_" + index);
      const tpField = document.getElementById("tp_" + index);
      if (examField && examValues[index] !== undefined) {
        examField.value = examValues[index];
      }
      if (ccField && ccValues[index] !== undefined) {
        ccField.value = ccValues[index];
      }
      if (subject.hasTP && tpField && tpValues[index] !== undefined) {
        tpField.value = tpValues[index];
      }
      if (coefValues[index] !== undefined) {
        subject.coefficient = parseFloat(coefValues[index]);
      }
    });
  }
  window.addEventListener("load", loadStorage);

  // ================= 6. CHECK SCORE FUNCTIONS =================
  function checkExam(field, index) {
    const value = parseFloat(field.value);
    const errorSpan = document.getElementById("cc_error_" + index); // Reusing error span for exam errors
    if (value > 20) {
      field.style.borderColor = "red";
      if (!field.nextElementSibling || !field.nextElementSibling.classList.contains("exam-error")) {
        const examErrorSpan = document.createElement("span");
        examErrorSpan.className = "exam-error";
        examErrorSpan.style.color = "red";
        examErrorSpan.innerText = examErrorMessages[currentLanguage];
        field.parentNode.insertBefore(examErrorSpan, field.nextSibling);
      } else {
        field.nextElementSibling.innerText = examErrorMessages[currentLanguage];
      }
      return true;
    } else {
      field.style.borderColor = "";
      if (field.nextElementSibling && field.nextElementSibling.classList.contains("exam-error")) {
        field.nextElementSibling.innerText = "";
      }
      return false;
    }
  }

  function checkCC(field, index) {
    const value = parseFloat(field.value);
    const errorSpan = document.getElementById("cc_error_" + index);
    if (value > 20) {
      field.style.borderColor = "red";
      if (errorSpan) {
        errorSpan.innerText = ccErrorMessages[currentLanguage];
        errorSpan.style.color = "red";
      }
      return true;
    } else {
      field.style.borderColor = "";
      if (errorSpan) {
        errorSpan.innerText = "";
      }
      return false;
    }
  }

  function updateCCErrorMessages() {
    subjects.forEach((subject, index) => {
      const ccField = document.getElementById("cc_" + index);
      if (ccField) {
        checkCC(ccField, index);
      }
    });
  }

  // ================= 7. CALCULATE AVERAGES =================
  function calculateAverages() {
    let overallWeightedSum = 0;
    let totalCoefficients = 0;
    const dict = languages[currentLanguage];
    const resultsTitle = dict.resultsTitle;
    const overallTitle = dict.overallTitle;
    let resultsHtml = `<h3>${resultsTitle}</h3><ul>`;

    // Loop through each subject and check if exam, CC, or TP is over 20; if so, skip calculation.
    for (let index = 0; index < subjects.length; index++) {
      const subject = subjects[index];
      const examScore = parseFloat(document.getElementById("exam_" + index)?.value) || 0;
      const ccScore = parseFloat(document.getElementById("cc_" + index)?.value) || 0;
      const tpScore = subject.hasTP ? (parseFloat(document.getElementById("tp_" + index)?.value) || 0) : 0;

      // If any score is over limit, display an error and skip calculation for this subject.
      if (examScore > 20) {
        resultsHtml += `<li>${subject[currentLanguage]}: <span style="color: red">${examErrorMessages[currentLanguage]}</span></li>`;
        continue;
      }
      if (ccScore > 20) {
        resultsHtml += `<li>${subject[currentLanguage]}: <span style="color: red">${ccErrorMessages[currentLanguage]}</span></li>`;
        continue;
      }
      if (subject.hasTP && tpScore > 20) {
        resultsHtml += `<li>${subject[currentLanguage]}: <span style="color: red">${tpErrorMessages[currentLanguage]}</span></li>`;
        continue;
      }

      let average = 0;
      let requiredCC = null;
      if (subject.hasTP) {
        average = (examScore * 0.6) + (ccScore * 0.2) + (tpScore * 0.2);
        if (average < 10) {
          requiredCC = (10 - (examScore * 0.6 + tpScore * 0.2)) / 0.2;
        }
      } else {
        average = (examScore * 0.6) + (ccScore * 0.4);
        if (average < 10) {
          requiredCC = (10 - (examScore * 0.6)) / 0.4;
        }
      }
      const color = average >= 10 ? "green" : "red";
      resultsHtml += `<li>${subject[currentLanguage]}: <span style="color: ${color}">${average.toFixed(2)}</span>`;
      if (average < 10 && requiredCC !== null) {
        if (requiredCC > 20) {
          resultsHtml += ` (Need CC: <span style="color: red">${requiredCC.toFixed(2)}</span>)`;
        } else {
          resultsHtml += ` (Need CC: ${requiredCC.toFixed(2)})`;
        }
      }
      resultsHtml += `</li>`;
      overallWeightedSum += average * subject.coefficient;
      totalCoefficients += subject.coefficient;
    }
    resultsHtml += "</ul>";
    const overallAverage = overallWeightedSum / totalCoefficients;
    const overallColor = overallAverage >= 10 ? "green" : "red";
    resultsHtml += `<h3>${overallTitle} <span style="color: ${overallColor}">${overallAverage.toFixed(2)}</span></h3>`;
    document.getElementById("resultDiv").innerHTML = resultsHtml;
  }

  // ================= 8. RESET FUNCTION =================
  function resetCalculator() {
    subjects.forEach((subject, index) => {
      const examField = document.getElementById("exam_" + index);
      const ccField = document.getElementById("cc_" + index);
      const tpField = document.getElementById("tp_" + index);
      if (examField) examField.value = "";
      if (ccField) ccField.value = "";
      if (tpField) tpField.value = "";
    });
    // Restore default coefficients (S3 preset)
    subjects = [
      { en: "Analysis",       fr: "Analyse",              ar: "تحليل",         coefficient: 4, hasTP: false },
      { en: "Chemistry",      fr: "Chimie",               ar: "كيمياء",        coefficient: 3, hasTP: true  },
      { en: "Computer Science", fr: "Informatique",      ar: "علوم الحاسوب",   coefficient: 3, hasTP: false },
      { en: "English",        fr: "Anglais",              ar: "انجليزية",       coefficient: 1, hasTP: false },
      { en: "Fluid Mechanic", fr: "Mécanique des Fluides", ar: "ميكانيك الموائع", coefficient: 3, hasTP: true  },
      { en: "French",         fr: "Français",             ar: "فرنسية",        coefficient: 1, hasTP: false },
      { en: "General Electric", fr: "Électricité Générale", ar: "كهرباء عامة",   coefficient: 3, hasTP: true  },
      { en: "Engineering",    fr: "Génie",                ar: "هندسة",         coefficient: 3, hasTP: false },
      { en: "Numerical Analysis", fr: "Analyse Numérique", ar: "تحليل عددي",    coefficient: 2, hasTP: false },
      { en: "Physics",        fr: "Physique",             ar: "فيزياء",        coefficient: 4, hasTP: true  },
      { en: "Rational Mechanic", fr: "Mécanique Rationnelle", ar: "ميكانيك نظري", coefficient: 3, hasTP: false }
    ];
    localStorage.removeItem("exam_scores");
    localStorage.removeItem("cc_scores");
    localStorage.removeItem("tp_scores");
    localStorage.removeItem("coef_scores");
    document.getElementById("resultDiv").innerHTML = "";
    renderSubjects();
  }

  // ================= 9. PRESET BUTTONS (S3 & S4) =================
  function setS3Coefficients() {
    subjects[0].coefficient = 4; // Analysis
    subjects[8].coefficient = 2; // Numerical Analysis
    updateStorage();
    renderSubjects();
    loadStorage();
  }

  function setS4Coefficients() {
    subjects[0].coefficient = 3; // Analysis
    subjects[8].coefficient = 3; // Numerical Analysis
    updateStorage();
    renderSubjects();
    loadStorage();
  }

  // ================= 10. INITIALIZE EVERYTHING =================
  renderSubjects();
  loadStorage();
  document.getElementById("calcButton").addEventListener("click", calculateAverages);
  document.getElementById("resetButton").addEventListener("click", resetCalculator);
  document.getElementById("s3Button").addEventListener("click", setS3Coefficients);
  document.getElementById("s4Button").addEventListener("click", setS4Coefficients);
  document.querySelectorAll(".lang-item").forEach(item => {
    item.addEventListener("click", function() {
      currentLanguage = this.getAttribute("data-lang");
      updateLanguage();
    });
  });
});
