/**
 * api/password-generator.js
 * Cryptographically Secure Pseudo-Random Number Generator (CSPRNG Engine)
 * RBEH Multiverse Implementation System
 */

document.addEventListener('DOMContentLoaded', () => {
  const outputField = document.getElementById('password-output');
  const genBtn = document.getElementById('btn-gen-primary');
  const copyBtn = document.getElementById('btn-action-copy');
  const clearBtn = document.getElementById('btn-action-clear');
  const clearHistoryBtn = document.getElementById('btn-clear-history');

  const lenSlider = document.getElementById('length-slider');
  const lenBadge = document.getElementById('length-val-badge');

  // Input structural components targets checkboxes DOM elements mapping arrays
  const chkUpper = document.getElementById('opt-upper');
  const chkLower = document.getElementById('opt-lower');
  const chkNums = document.getElementById('opt-nums');
  const chkSyms = document.getElementById('opt-syms');
  const chkSim = document.getElementById('opt-sim');
  const chkAmb = document.getElementById('opt-amb');
  const chkSeq = document.getElementById('opt-seq');
  const chkRep = document.getElementById('opt-rep');

  // Dashboard Telemetry Fields DOM elements nodes markers
  const badgeLbl = document.getElementById('strength-badge-lbl');
  const barFill = document.getElementById('strength-bar-fill');
  const statEntropy = document.getElementById('stat-entropy');
  const statCrack = document.getElementById('stat-crack');
  const statRand = document.getElementById('stat-rand');
  const historyContainer = document.getElementById('history-logs-container');

  // Initialize and register lifecycle event hooks bindings handlers arrays
  if (lenSlider && lenBadge) {
    lenSlider.addEventListener('input', () => {
      lenBadge.innerText = `${lenSlider.value} Characters`;
      triggerAutoGenerationSequence();
    });
  }

  // Bind monitoring event trackers on option modifications state vectors
  const optionTriggers = [chkUpper, chkLower, chkNums, chkSyms, chkSim, chkAmb, chkSeq, chkRep];
  optionTriggers.forEach(element => {
    if (element) element.addEventListener('change', triggerAutoGenerationSequence);
  });

  // Wire presets row targets loops bindings setup channels
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetedLength = btn.getAttribute('data-len');
      if (lenSlider && lenBadge) {
        lenSlider.value = targetedLength;
        lenBadge.innerText = `${targetedLength} Characters`;
      }
      triggerAutoGenerationSequence();
    });
  });

  if (genBtn) genBtn.addEventListener('click', triggerAutoGenerationSequence);

  if (clearBtn && outputField) {
    clearBtn.addEventListener('click', () => {
      outputField.value = '';
      outputField.placeholder = "Cleared vector pipelines states. Request seed generation loop.";
      resetMetricsUIDisplayTrack();
    });
  }

  if (copyBtn && outputField) {
    copyBtn.addEventListener('click', async () => {
      const textVal = outputField.value;
      if (!textVal || textVal.startsWith("Click") || textVal.startsWith("Error")) return;
      try {
        await navigator.clipboard.writeText(textVal);
        const baselineText = copyBtn.innerText;
        copyBtn.innerText = "✅ Copied Array String!";
        setTimeout(() => { copyBtn.innerText = baselineText; }, 1800);
      } catch (err) {
        console.error("Trace failure writing buffer context arrays streams values", err);
      }
    });
  }

  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', () => {
      localStorage.removeItem('rbeh-pwd-history-vault');
      renderHistoryRegistryViewUI();
    });
  }

  // Trigger base payload on entry lifecycle boot track loop channel
  triggerAutoGenerationSequence();

  /**
   * Main Operational Gateway Wrapper Logic Pipeline Function Node
   */
  function triggerAutoGenerationSequence() {
    const totalLength = parseInt(lenSlider?.value || 16);

    // Character Sets Array Pools Mapping Matrices Setup
    let charPoolString = "";
    if (chkUpper?.checked) charPoolString += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (chkLower?.checked) charPoolString += "abcdefghijklmnopqrstuvwxyz";
    if (chkNums?.checked)  charPoolString += "0123456789";
    if (chkSyms?.checked)  charPoolString += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    // Absolute Error Flag check tracking validation condition boundaries parameters bounds
    if (!charPoolString) {
      if (outputField) {
        outputField.value = "";
        outputField.placeholder = "Error: Select at least 1 Character Type Matrix Constraints Flag!";
      }
      resetMetricsUIDisplayTrack();
      return;
    }

    // Process exclusion boundaries filtering array models filters
    if (chkSim?.checked) {
      // Strips O, 0, I, l, 1 characters sequences properties boundaries vectors
      charPoolString = charPoolString.replace(/[O0Il1]/g, "");
    }
    if (chkAmb?.checked) {
      // Strips complex lookalike syntax parameters metrics bounds markers structures
      charPoolString = charPoolString.replace(/[{}[\]()\/\\'`",.;:<>~\|\-_]/g, "");
    }

    // Edge check fallback condition array checks bounds after scrubbing sequences
    if (charPoolString.length === 0) {
      if (outputField) outputField.value = "Error: Pool exhausted under filter parameters!";
      resetMetricsUIDisplayTrack();
      return;
    }

    let passwordGeneratedOutput = "";
    try {
      passwordGeneratedOutput = executeSecureCSPRNGAlgorithm(charPoolString, totalLength, chkSeq?.checked, chkRep?.checked);
    } catch(err) {
      console.error(err);
      if(outputField) outputField.value = "Internal Core Security Engine Calculation Trap Alert";
      return;
    }

    if (outputField) {
      outputField.value = passwordGeneratedOutput;
    }

    // Compile telemetry metric analysis metrics maps
    computeAndSyncTelemetryDashboardUI(passwordGeneratedOutput, charPoolString.length);
    pushToSessionHistoryRegistryLocalStorage(passwordGeneratedOutput);
  }

  /**
   * Cryptographically Secure Pseudo-Random Number Generation Engine Framework Logic Node
   */
  function executeSecureCSPRNGAlgorithm(pool, length, avoidSequential, avoidRepeated) {
    let outputResult = "";
    const poolLength = pool.length;
    
    // Allocate secure memory buffer array values pointers allocation limits bound loop context channel
    const safeBufferUint32Array = new Uint32Array(length * 4); 
    window.crypto.getRandomValues(safeBufferUint32Array);

    let bufferPointerIndex = 0;
    let fallbackIterationLimitCounter = 0;

    while (outputResult.length < length && fallbackIterationLimitCounter < 2000) {
      fallbackIterationLimitCounter++;
      
      if (bufferPointerIndex >= safeBufferUint32Array.length) {
        window.crypto.getRandomValues(safeBufferUint32Array);
        bufferPointerIndex = 0;
      }

      const randomValueIntegerIndex = safeBufferUint32Array[bufferPointerIndex] % poolLength;
      const proposedCharacterCandidate = pool.charAt(randomValueIntegerIndex);
      bufferPointerIndex++;

      // Structural Pattern Filtering Criteria Constraints checks matching pipeline layers
      if (avoidRepeated && outputResult.length > 0) {
        const structuralLastAddedChar = outputResult.charAt(outputResult.length - 1);
        if (proposedCharacterCandidate === structuralLastAddedChar) continue;
      }

      if (avoidSequential && outputResult.length > 0) {
        const priorAddedCharCode = outputResult.charCodeAt(outputResult.length - 1);
        const candidateCharCode = proposedCharacterCandidate.charCodeAt(0);
        if (Math.abs(priorAddedCharCode - candidateCharCode) === 1) continue;
      }

      outputResult += proposedCharacterCandidate;
    }

    // Safety fallback channel track constraint layer bypass validation system index metrics
    if (outputResult.length < length) {
      for (let i = outputResult.length; i < length; i++) {
        outputResult += pool.charAt(safeBufferUint32Array[i % safeBufferUint32Array.length] % poolLength);
      }
    }

    return outputResult;
  }

  function computeAndSyncTelemetryDashboardUI(password, poolSize) {
    if (!password) return;
    
    // Shannon Entropy Allocation calculations logic mapping arrays: Log2(PoolSize) * Length
    const totalEntropyBitsValue = Math.log2(poolSize) * password.length;

    if (statEntropy) statEntropy.innerText = `${totalEntropyBitsValue.toFixed(2)} bits`;
    
    // Determine crack calculation intervals models properties trackers
    let estimationTierText = "Instantaneous";
    if (totalEntropyBitsValue >= 120) estimationTierText = "Eternity Grade";
    else if (totalEntropyBitsValue >= 80) estimationTierText = "Centuries Complex";
    else if (totalEntropyBitsValue >= 55) estimationTierText = "10 to 80 Years";
    else if (totalEntropyBitsValue >= 35) estimationTierText = "A few Weeks/Months";
    else if (totalEntropyBitsValue >= 20) estimationTierText = "Minutes to Hours";

    if (statCrack) statCrack.innerText = estimationTierText;
    if (statRand)  statRand.innerText = "100% Secure";

    // Map tier badge values indicators structures colors tracking bounds parameters
    let tierText = "🔴 Very Weak";
    let colorHexCode = "#e8312f";
    let widthFillPercent = 15;

    if (totalEntropyBitsValue >= 100) {
      tierText = "🟢🟢 Very Strong";
      colorHexCode = "#15803d";
      widthFillPercent = 100;
    } else if (totalEntropyBitsValue >= 75) {
      tierText = "🟢 Strong";
      colorHexCode = "#1fa75a";
      widthFillPercent = 80;
    } else if (totalEntropyBitsValue >= 50) {
      tierText = "🟡 Medium";
      colorHexCode = "#eab308";
      widthFillPercent = 55;
    } else if (totalEntropyBitsValue >= 30) {
      tierText = "🟠 Weak";
      colorHexCode = "#f97316";
      widthFillPercent = 35;
    }

    if (badgeLbl) {
      badgeLbl.innerText = tierText;
      badgeLbl.style.color = colorHexCode;
    }
    if (barFill) {
      barFill.style.width = `${widthFillPercent}%`;
      barFill.style.backgroundColor = colorHexCode;
    }
  }

  function resetMetricsUIDisplayTrack() {
    if (badgeLbl) { badgeLbl.innerText = "🔴 Suspended States"; badgeLbl.style.color = "inherit"; }
    if (barFill) barFill.style.width = "0%";
    if (statEntropy) statEntropy.innerText = "0.00 bits";
    if (statCrack) statCrack.innerText = "Instant";
    if (statRand) statRand.innerText = "0%";
  }

  function pushToSessionHistoryRegistryLocalStorage(newPwdString) {
    if(!newPwdString || newPwdString.startsWith("Error")) return;
    
    let currentHistoryVaultList = JSON.parse(localStorage.getItem('rbeh-pwd-history-vault') || '[]');
    
    // Prevent duplicated registry tracking indicators tracking arrays mappings
    if (currentHistoryVaultList.length > 0 && currentHistoryVaultList[0].password === newPwdString) return;

    const itemRecordPayload = {
      password: newPwdString,
      length: newPwdString.length,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    currentHistoryVaultList.unshift(itemRecordPayload);
    if (currentHistoryVaultList.length > 10) {
      currentHistoryVaultList = currentHistoryVaultList.slice(0, 10);
    }

    localStorage.setItem('rbeh-pwd-history-vault', JSON.stringify(currentHistoryVaultList));
    renderHistoryRegistryViewUI();
  }

  function renderHistoryRegistryViewUI() {
    if (!historyContainer) return;
    const arrayList = JSON.parse(localStorage.getItem('rbeh-pwd-history-vault') || '[]');

    if (arrayList.length === 0) {
      historyContainer.innerHTML = `<div style="font-size: 12px; opacity: 0.5; padding: 20px 0; text-align: center;">No passwords initialized during this window lifecycle loop state.</div>`;
      return;
    }

    historyContainer.innerHTML = '';
    arrayList.forEach((item, index) => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'history-item';
      rowDiv.innerHTML = `
        <div style="font-family: monospace; font-weight: 700; word-break: break-all; max-width: 65%;" title="${item.password}">${item.password}</div>
        <div style="font-size: 11px; opacity: 0.6; display: flex; align-items: center; gap: 8px;">
          <span>(${item.length} ch)</span>
          <button class="copy-hist-btn" data-pwd="${item.password}" style="color: #e8312f; cursor: pointer; font-weight:700;">Copy</button>
        </div>
      `;
      historyContainer.appendChild(rowDiv);
    });

    // Wire copy buttons on injected logs list items elements strings
    document.querySelectorAll('.copy-hist-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const stringToCopy = btn.getAttribute('data-pwd');
        try {
          await navigator.clipboard.writeText(stringToCopy);
          btn.innerText = "Copied!";
          setTimeout(() => { btn.innerText = "Copy"; }, 1500);
        } catch(err) {}
      });
    });
  }
});