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
      thTP: "درجة التدريب",
      calcButton: "احسب المعدل",
      resultsTitle: "المعدلات حسب المادة:",
      overallTitle: "المعدل العام:"
    }
  };

  // ================= 2. ERROR MESSAGES FOR SCORE LIMIT =================
  const examErrorMessages = {
    en: "Error: Score over limit (max 20)",
    fr: "Erreur : Note hors limite (max 20)",
    ar: "خطأ: الدرجة فوق الحد (20 كحد أقصى)"
  };
  const ccErrorMessages = {
    en: "Error: Score over limit (max 20)",
    fr: "Erreur : Note hors limite (max 20)",
    ar: "خطأ: الدرجة فوق الحد (20 كحد أقصى)"
  };
  const tpErrorMessages = {
    en: "Error: Score over limit (max 20)",
    fr: "Erreur : Note hors limite (max 20)",
    ar: "خطأ: الدرجة فوق الحد (20 كحد أقصى)"
  };

  // ================= 3. SUBJECTS PRESETS =================
  // S1 preset subjects (11 subjects)
  const s1Subjects = [
    { en: "Chemistry", fr: "Chimie", ar: "كيمياء", coefficient: 5, hasTP: true },
    { en: "Physics", fr: "Physique", ar: "فيزياء", coefficient: 5, hasTP: true },
    { en: "Human Engineering", fr: "Ingénierie Humaine", ar: "الهندسة الإنسانية", coefficient: 1, hasTP: false },
    { en: "French", fr: "Français", ar: "فرنسية", coefficient: 1, hasTP: false },
    { en: "English", fr: "Anglais", ar: "إنجليزية", coefficient: 1, hasTP: false },
    { en: "General Economy", fr: "Economie Générale", ar: "Économie Générale", coefficient: 1, hasTP: false },
    { en: "Algebra", fr: "Algèbre", ar: "جبر", coefficient: 3, hasTP: false },
    { en: "Statistics", fr: "Statistique", ar: "إحصاء", coefficient: 3, hasTP: false },
    { en: "Analysis", fr: "Analyse", ar: "تحليل", coefficient: 6, hasTP: false },
    { en: "Computer Science", fr: "Informatique", ar: "علوم الحاسوب", coefficient: 3, hasTP: false },
    { en: "Technical Drawing", fr: "Dessin Technique", ar: "رسم تقني", coefficient: 1, hasTP: false }
  ];

  // S2 preset subjects (11 subjects)
  const s2Subjects = [
    { en: "Chemistry", fr: "Chimie", ar: "كيمياء", coefficient: 5, hasTP: true },
    { en: "Physics", fr: "Physique", ar: "فيزياء", coefficient: 5, hasTP: true },
    { en: "Human Engineering", fr: "Ingénierie Humaine", ar: "الهندسة الإنسانية", coefficient: 1, hasTP: false },
    { en: "French", fr: "Français", ar: "فرنسية", coefficient: 1, hasTP: false },
    { en: "English", fr: "Anglais", ar: "إنجليزية", coefficient: 1, hasTP: false },
    { en: "General Economy", fr: "Economie Générale", ar: "Économie Générale", coefficient: 1, hasTP: false },
    { en: "Algebra", fr: "Algèbre", ar: "جبر", coefficient: 4, hasTP: false },
    { en: "Probabilities", fr: "Probabilités", ar: "احتمالات", coefficient: 3, hasTP: false },
    { en: "Analysis", fr: "Analyse", ar: "تحليل", coefficient: 5, hasTP: false },
    { en: "Computer Science", fr: "Informatique", ar: "علوم الحاسوب", coefficient: 3, hasTP: false },
    { en: "CAO", fr: "CAO", ar: "تصميم بمساعدة الحاسوب", coefficient: 1, hasTP: false }
  ];

  // S3 preset subjects (11 subjects) – default preset
  const s3Subjects = [
    { en: "Analysis",       fr: "Analyse",              ar: "تحليل",         coefficient: 4, hasTP: false },
    { en: "Chemistry",      fr: "Chimie",               ar: "كيمياء",        coefficient: 3, hasTP: true },
    { en: "Computer Science", fr: "Informatique",      ar: "علوم الحاسوب",   coefficient: 3, hasTP: false },
    { en: "English",        fr: "Anglais",              ar: "انجليزية",       coefficient: 1, hasTP: false },
    { en: "Fluid Mechanic", fr: "Mécanique des Fluides", ar: "ميكانيك الموائع", coefficient: 3, hasTP: true },
    { en: "French",         fr: "Français",             ar: "فرنسية",        coefficient: 1, hasTP: false },
    { en: "General Electric", fr: "Électricité Générale", ar: "كهرباء عامة",   coefficient: 3, hasTP: true },
    { en: "Engineering",    fr: "Génie",                ar: "هندسة",         coefficient: 3, hasTP: false },
    { en: "Numerical Analysis", fr: "Analyse Numérique", ar: "تحليل عددي",    coefficient: 2, hasTP: false },
    { en: "Physics",        fr: "Physique",             ar: "فيزياء",        coefficient: 4, hasTP: true },
    { en: "Rational Mechanic", fr: "Mécanique Rationnelle", ar: "ميكانيك نظري", coefficient: 3, hasTP: false }
  ];

  // S4 preset subjects (S3 with modifications: Analysis=3, Numerical Analysis=3)
  const s4Subjects = s3Subjects.map((subj, index) => {
    let newSubj = Object.assign({}, subj);
    if (index === 0) newSubj.coefficient = 3; // Analysis
    if (index === 8) newSubj.coefficient = 3; // Numerical Analysis
    return newSubj;
  });

  // ================= 4. INITIAL PRESET =================
  // Default preset is S3.
  let currentPreset = "S3";
  let currentSubjects = s3Subjects.map(s => Object.assign({}, s));

  // ================= 5. LANGUAGE SWITCHING =================
  let currentLanguage = "en";
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

  // ================= 6. UPDATE ACTIVE PRESET BUTTON =================
  function updateActivePresetButton() {
    const presets = ["s1", "s2", "s3", "s4"];
    presets.forEach(preset => {
      const btn = document.getElementById(preset + "Button");
      if (preset.toUpperCase() === currentPreset) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  // ================= 7. RENDER SUBJECTS TABLE =================
  function renderSubjects() {
    const tbody = document.getElementById("subjectsTable");
    tbody.innerHTML = "";
    currentSubjects.forEach((subject, index) => {
      const tr = document.createElement("tr");

      // Subject Name
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

      // TP Score Input (if applicable)
      const tdTP = document.createElement("td");
      if (subject.hasTP) {
        const inputTP = document.createElement("input");
        inputTP.type = "number";
        inputTP.step = "0.01";
        inputTP.className = "form-control";
        inputTP.id = "tp_" + index;
        tdTP.appendChild(inputTP);
        inputTP.addEventListener("input", function() {
          updateStorage();
          checkTP(inputTP, index);
        });
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
    updateActivePresetButton();
  }

  // ================= 8. LOCAL STORAGE: SAVE & LOAD =================
  function updateStorage() {
    let examValues = [];
    let ccValues = [];
    let tpValues = [];
    let coefValues = [];
    currentSubjects.forEach((subject, index) => {
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
    localStorage.setItem("exam_scores_" + currentPreset, JSON.stringify(examValues));
    localStorage.setItem("cc_scores_" + currentPreset, JSON.stringify(ccValues));
    localStorage.setItem("tp_scores_" + currentPreset, JSON.stringify(tpValues));
    localStorage.setItem("coef_scores_" + currentPreset, JSON.stringify(coefValues));
  }

  function loadStorage() {
    const examValues = JSON.parse(localStorage.getItem("exam_scores_" + currentPreset) || "[]");
    const ccValues = JSON.parse(localStorage.getItem("cc_scores_" + currentPreset) || "[]");
    const tpValues = JSON.parse(localStorage.getItem("tp_scores_" + currentPreset) || "[]");
    const coefValues = JSON.parse(localStorage.getItem("coef_scores_" + currentPreset) || "[]");
    currentSubjects.forEach((subject, index) => {
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

  // ================= 9. CHECK SCORE FUNCTIONS =================
  function checkExam(field, index) {
    const value = parseFloat(field.value);
    if (value > 20) {
      field.style.borderColor = "red";
      return true;
    } else {
      field.style.borderColor = "";
      return false;
    }
  }

  function checkCC(field, index) {
    const value = parseFloat(field.value);
    const errorSpan = document.getElementById("cc_error_" + index);
    if (value > 20) {
      field.style.borderColor = "red";
      if (errorSpan) {
        errorSpan.innerText = ""; // No extra text displayed
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

  function checkTP(field, index) {
    const value = parseFloat(field.value);
    if (value > 20) {
      field.style.borderColor = "red";
      return true;
    } else {
      field.style.borderColor = "";
      return false;
    }
  }

  function updateCCErrorMessages() {
    currentSubjects.forEach((subject, index) => {
      const ccField = document.getElementById("cc_" + index);
      if (ccField) {
        checkCC(ccField, index);
      }
    });
  }

  // ================= 10. CALCULATE AVERAGES =================
  function calculateAverages() {
    let overallWeightedSum = 0;
    let totalCoefficients = 0;
    const dict = languages[currentLanguage];
    const resultsTitle = dict.resultsTitle;
    const overallTitle = dict.overallTitle;
    let resultsHtml = `<h3>${resultsTitle}</h3><ul>`;

    for (let index = 0; index < currentSubjects.length; index++) {
      const subject = currentSubjects[index];
      const examScore = parseFloat(document.getElementById("exam_" + index)?.value) || 0;
      const ccScore = parseFloat(document.getElementById("cc_" + index)?.value) || 0;
      const tpScore = subject.hasTP ? (parseFloat(document.getElementById("tp_" + index)?.value) || 0) : 0;

      // If any score is over limit, display error and skip calculation for this subject.
      if (examScore > 20 || ccScore > 20 || (subject.hasTP && tpScore > 20)) {
        resultsHtml += `<li>${subject[currentLanguage]}: <span style="color: red">Error: Score over limit (max 20)</span></li>`;
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

  // ================= 11. RESET FUNCTION =================
  function resetCalculator() {
    currentSubjects.forEach((subject, index) => {
      const examField = document.getElementById("exam_" + index);
      const ccField = document.getElementById("cc_" + index);
      const tpField = document.getElementById("tp_" + index);
      if (examField) examField.value = "";
      if (ccField) ccField.value = "";
      if (tpField) tpField.value = "";
    });
    // Restore default preset (S3 preset)
    currentPreset = "S3";
    currentSubjects = s3Subjects.map(s => Object.assign({}, s));
    localStorage.removeItem("exam_scores_" + currentPreset);
    localStorage.removeItem("cc_scores_" + currentPreset);
    localStorage.removeItem("tp_scores_" + currentPreset);
    localStorage.removeItem("coef_scores_" + currentPreset);
    document.getElementById("resultDiv").innerHTML = "";
    renderSubjects();
  }

  // ================= 12. PRESET BUTTONS (S1, S2, S3, S4) =================
  function setS1Subjects() {
    currentPreset = "S1";
    currentSubjects = s1Subjects.map(s => Object.assign({}, s));
    updateActivePresetButton();
    renderSubjects();
    loadStorage();
  }
  function setS2Subjects() {
    currentPreset = "S2";
    currentSubjects = s2Subjects.map(s => Object.assign({}, s));
    updateActivePresetButton();
    renderSubjects();
    loadStorage();
  }
  function setS3Subjects() {
    currentPreset = "S3";
    currentSubjects = s3Subjects.map(s => Object.assign({}, s));
    updateActivePresetButton();
    renderSubjects();
    loadStorage();
  }
  function setS4Subjects() {
    currentPreset = "S4";
    currentSubjects = s4Subjects.map(s => Object.assign({}, s));
    updateActivePresetButton();
    renderSubjects();
    loadStorage();
  }

  // ================= 13. UPDATE ACTIVE PRESET BUTTON =================
  function updateActivePresetButton() {
    const presets = ["s1", "s2", "s3", "s4"];
    presets.forEach(preset => {
      const btn = document.getElementById(preset + "Button");
      if (preset.toUpperCase() === currentPreset) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  // ================= 14. INITIALIZE EVERYTHING =================
  currentPreset = "S3";
  currentSubjects = s3Subjects.map(s => Object.assign({}, s));
  updateActivePresetButton();
  renderSubjects();
  loadStorage();
  document.getElementById("calcButton").addEventListener("click", calculateAverages);
  document.getElementById("resetButton").addEventListener("click", resetCalculator);
  document.getElementById("s1Button").addEventListener("click", setS1Subjects);
  document.getElementById("s2Button").addEventListener("click", setS2Subjects);
  document.getElementById("s3Button").addEventListener("click", setS3Subjects);
  document.getElementById("s4Button").addEventListener("click", setS4Subjects);
  document.querySelectorAll(".lang-item").forEach(item => {
    item.addEventListener("click", function() {
      currentLanguage = this.getAttribute("data-lang");
      updateLanguage();
    });
  });
});
