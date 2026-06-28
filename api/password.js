/**
 * api/password.js
 * Core Password Strength Checker Diagnostic Computations - RBEH Multiverse Web Stack
 */

document.addEventListener('DOMContentLoaded', () => {
  const pwdInput = document.getElementById('password-input');
  const toggleBtn = document.getElementById('toggle-password-visibility');
  const checkBtn = document.getElementById('btn-action-check');
  const copyBtn = document.getElementById('btn-action-copy');
  const clearBtn = document.getElementById('btn-action-clear');
  const eyeIcon = document.getElementById('eye-icon');

  const resultsWrapper = document.getElementById('results-display-wrapper');
  const fallbackAlert = document.getElementById('fallback-empty-alert');

  // UI elements updates target mapping nodes
  const strengthBadge = document.getElementById('strength-badge-tier');
  const progressFill = document.getElementById('strength-progress-fill');
  const circleBar = document.getElementById('score-circle-bar');
  const scoreText = document.getElementById('score-text-counter');
  const tipsList = document.getElementById('recommendations-tips-list');
  const tipsBox = document.getElementById('tips-box-panel');

  // Checklist DOM binding nodes
  const chkLen = document.getElementById('chk-len');
  const chkUpper = document.getElementById('chk-upper');
  const chkLower = document.getElementById('chk-lower');
  const chkNum = document.getElementById('chk-num');
  const chkSpec = document.getElementById('chk-spec');
  const chkCom = document.getElementById('chk-com');
  const chkSeq = document.getElementById('chk-seq');
  const chkGood = document.getElementById('chk-good');

  // Statistics nodes
  const statLen = document.getElementById('stat-len-val');
  const statEntropy = document.getElementById('stat-entropy-val');
  const statCrack = document.getElementById('stat-crack-val');
  const statComplex = document.getElementById('stat-complex-val');

  // Common blacklisted vectors matching structures dictionary arrays
  const COMMON_PASSWORDS = [
    '123456', 'password', 'admin', 'qwerty', 'welcome', 'iloveyou', 
    '123123', 'password123', '123456789', 'administrator', 'root'
  ];

  if (pwdInput) {
    // Input monitoring key event trace matching logic execution array
    pwdInput.addEventListener('input', () => {
      evaluatePasswordMatrix(pwdInput.value);
    });

    if (checkBtn) {
      checkBtn.addEventListener('click', () => {
        evaluatePasswordMatrix(pwdInput.value);
        if(!pwdInput.value.trim()) {
          pwdInput.focus();
        }
      });
    }
  }

  // Input Password Visibility Toggle Handler
  if (toggleBtn && pwdInput) {
    toggleBtn.addEventListener('click', () => {
      if (pwdInput.type === 'password') {
        pwdInput.type = 'text';
        if (eyeIcon) {
          eyeIcon.innerHTML = `
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          `;
        }
      } else {
        pwdInput.type = 'password';
        if (eyeIcon) {
          eyeIcon.innerHTML = `
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          `;
        }
      }
    });
  }

  // Action: Copy Clipboard String Vector Data Hook
  if (copyBtn && pwdInput) {
    copyBtn.addEventListener('click', async () => {
      const val = pwdInput.value;
      if (!val) return;
      try {
        await navigator.clipboard.writeText(val);
        const originalText = copyBtn.innerText;
        copyBtn.innerText = "✅ Copied String!";
        setTimeout(() => { copyBtn.innerText = originalText; }, 2000);
      } catch (err) {
        console.error("Could not trace clipboard write sequence permissions", err);
      }
    });
  }

  // Action: Structural Fields Reset Clean Loop Channel
  if (clearBtn && pwdInput) {
    clearBtn.addEventListener('click', () => {
      pwdInput.value = '';
      evaluatePasswordMatrix('');
      pwdInput.focus();
    });
  }

  /**
   * Main Engine Calculation Matrix Execution Pipeline
   * @param {string} pwd 
   */
  function evaluatePasswordMatrix(pwd) {
    if (!pwd) {
      if (resultsWrapper) resultsWrapper.style.display = 'none';
      if (fallbackAlert) {
        fallbackAlert.style.display = 'block';
        fallbackAlert.innerText = "💡 Please enter a password to safely trigger calculations inside our sandboxed execution matrix.";
      }
      return;
    }

    // Toggle display frameworks nodes
    if (resultsWrapper) resultsWrapper.style.display = 'block';
    if (fallbackAlert) fallbackAlert.style.display = 'none';

    // Checklist tracking criteria structures variables definitions
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNum = /[0-9]/.test(pwd);
    const hasSpec = /[^A-Za-z0-9]/.test(pwd);
    const hasLenMin = pwd.length >= 8;
    const hasLenGood = pwd.length >= 12;

    // Common Password Check loop
    const isCommon = COMMON_PASSWORDS.includes(pwd.toLowerCase());

    // Sequential Sequence Patterns check (e.g. abc, 123, qwe)
    const hasSequential = checkSequentialPatterns(pwd);

    // Update Live Requirement Checklist UI Blocks Layer
    updateChecklistItemUI(chkLen, hasLenMin);
    updateChecklistItemUI(chkUpper, hasUpper);
    updateChecklistItemUI(chkLower, hasLower);
    updateChecklistItemUI(chkNum, hasNum);
    updateChecklistItemUI(chkSpec, hasSpec);
    updateChecklistItemUI(chkCom, !isCommon);
    updateChecklistItemUI(chkSeq, !hasSequential);
    updateChecklistItemUI(chkGood, hasLenGood);

    // Calculate Absolute Character Diversity and Shannon Entropy Bits Allocation Arrays
    let poolSize = 0;
    if (hasLower) poolSize += 26;
    if (hasUpper) poolSize += 26;
    if (hasNum) poolSize += 10;
    if (hasSpec) poolSize += 33; // Approx ASCII unique special symbols bounds parameters

    if (poolSize === 0) poolSize = 1;
    const entropyBits = Math.log2(poolSize) * pwd.length;

    // Core Strength Scoring System calculation allocation matrices (Range 0 - 100)
    let finalScore = 0;
    
    // Length contribution weighting layers bounds tracking variables
    finalScore += Math.min(pwd.length * 4, 40); 

    // Character diversity inclusion points multipliers
    if (hasLower) finalScore += 10;
    if (hasUpper) finalScore += 12;
    if (hasNum) finalScore += 12;
    if (hasSpec) finalScore += 16;

    // Deduct severe tracking penalties matrices parameters
    if (isCommon) finalScore -= 45;
    if (hasSequential) finalScore -= 20;

    // Bounds constraint matching validation arrays thresholds normalization limits
    if (finalScore < 5 && pwd.length > 0) finalScore = 5;
    if (finalScore > 100) finalScore = 100;
    if (isCommon && finalScore > 20) finalScore = 15; // Hard limits validation cap override

    // Generate Scoring Tier Ranges Framework Allocations Mapping Arrays
    let tierText = "🔴 Very Weak";
    let tierColor = "#e8312f"; // Standard theme red line anchor boundary map values
    let complexText = "Very Low";

    if (finalScore >= 85) {
      tierText = "🟢🟢 Very Strong";
      tierColor = "#15803d"; // Deep Secure Green line color match system
      complexText = "Military Grade Extreme Entropy";
    } else if (finalScore >= 65) {
      tierText = "🟢 Strong";
      tierColor = "#1fa75a"; // Theme Standard compliance green alignment pointer
      complexText = "High Complexity Bounds";
    } else if (finalScore >= 45) {
      tierText = "🟡 Medium";
      tierColor = "#eab308"; // Standard security mid orange warning pointer index mapping
      complexText = "Moderate Diversity";
    } else if (finalScore >= 25) {
      tierText = "🟠 Weak";
      tierColor = "#f97316"; // System alert medium danger amber tracking code
      complexText = "Low Structural Entitlements";
    }

    // Direct UI assignment triggers mapping structures pipeline nodes targets
    if (strengthBadge) {
      strengthBadge.innerText = tierText;
      strengthBadge.style.color = tierColor;
    }
    if (progressFill) {
      progressFill.style.width = `${finalScore}%`;
      progressFill.style.backgroundColor = tierColor;
    }

    // Sync Circular Progress dashboard UI components elements values metrics
    if (scoreText) scoreText.innerText = finalScore;
    if (circleBar) {
      const circumference = 2 * Math.PI * 45; // Equal to 282.6 constant matching layouts setup
      const offsetValue = circumference - (finalScore / 100) * circumference;
      circleBar.style.strokeDashoffset = offsetValue;
      circleBar.style.stroke = tierColor;
    }

    // Update Statistics Metadata metrics panels
    if (statLen) statLen.innerText = pwd.length;
    if (statEntropy) statEntropy.innerText = `${entropyBits.toFixed(2)} bits`;
    if (statComplex) {
      statComplex.innerText = complexText;
      statComplex.style.color = tierColor;
    }
    if (statCrack) statCrack.innerText = calculateEstimatedCrackDurationTime(entropyBits, isCommon);

    // Generate Remediation Recommendation dynamic suggestions loops
    generateRecommendationsDashboardUI(pwd, hasUpper, hasLower, hasNum, hasSpec, hasLenMin, hasLenGood, isCommon, hasSequential, tipsList, tipsBox, tierColor);
  }

  function updateChecklistItemUI(node, isPassed) {
    if (!node) return;
    const icon = node.querySelector('.status-icon');
    if (isPassed) {
      node.classList.add('passed');
      if (icon) icon.innerText = "✔";
    } else {
      node.classList.remove('passed');
      if (icon) icon.innerText = "❌";
    }
  }

  function checkSequentialPatterns(str) {
    const sequenceDicts = [
      "abcdefghijklmnopqrstuvwxyz",
      "01234567890",
      "qwertyuiopasdfghjklzxcvbnm"
    ];
    const targetNormalized = str.toLowerCase();
    if(targetNormalized.length < 3) return false;

    for (let i = 0; i < targetNormalized.length - 2; i++) {
      const subCluster = targetNormalized.substring(i, i + 3);
      for (const sequence of sequenceDicts) {
        if (sequence.includes(subCluster)) {
          return true;
        }
      }
    }
    return false;
  }

  function calculateEstimatedCrackDurationTime(entropy, isBlacklisted) {
    if (isBlacklisted) return "Instantaneous (Dictionary Database hit)";
    
    // Estimates mapped inside common 100 Billion guesses per second supercomputing array models
    if (entropy < 28) return "Instantaneous";
    if (entropy < 36) return "A few seconds to minutes";
    if (entropy < 50) return "A few days to weeks";
    if (entropy < 65) return "Several months to 5 years";
    if (entropy < 80) return "Approx. 200 to 8,000 Years";
    return "Centuries (Extremely Cryptographically Secure)";
  }

  function generateRecommendationsDashboardUI(pwd, up, lw, nm, sp, lenM, lenG, com, seq, targetList, targetBox, borderAccent) {
    if (!targetList) return;
    targetList.innerHTML = '';
    
    const adviceArray = [];

    if (com) adviceArray.push("⚠️ <strong>Critical Alert:</strong> This string belongs to common word leakage lists. Avoid using text signatures that appear inside public breach leaks lists.");
    if (!lenM) adviceArray.push("Increase absolute text length to at least 8 or ideally 12+ strings parameters.");
    if (!up) adviceArray.push("Inject Uppercase alphabetic profiles components ([A-Z]).");
    if (!lw) adviceArray.push("Inject Lowercase standard string indicators keys elements ([a-z]).");
    if (!nm) adviceArray.push("Integrate numerical integers integers characters clusters ([0-9]).");
    if (!sp) adviceArray.push("Incorporate unique explicit algorithmic characters types components symbols (e.g. @, #, $, !, %).");
    if (seq) adviceArray.push("Remove simple keyboard sequence traces arrays paths sequences (e.g. '123' or 'abc' clusters).");
    if (lenM && !lenG) adviceArray.push("Good start. Extending characters parameters length to 14 characters helps build strong passphrases mapping.");

    if (adviceArray.length === 0) {
      adviceArray.push("✨ Security Audit Cleared. Your string architecture satisfies high defensive guidelines.");
    }

    adviceArray.forEach(tip => {
      const li = document.createElement('li');
      li.innerHTML = tip;
      targetList.appendChild(li);
    });

    if (targetBox) {
      targetBox.style.borderColor = borderAccent;
    }
  }
});