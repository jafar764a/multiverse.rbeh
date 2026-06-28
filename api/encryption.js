/**
 * api/encryption.js
 * Browser Web Crypto API - Standalone Cryptographic Calculation Framework
 * RBEH Multiverse Implementation Core Node
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements Mapping Matrix Channels
  const textInput = document.getElementById('text-input');
  const secretKey = document.getElementById('secret-key');
  const algoSelector = document.getElementById('algo-selector');
  const algoExplainer = document.getElementById('algo-explainer-card');
  const cryptOutput = document.getElementById('crypt-output-box');
  const outputLabel = document.getElementById('output-label-tag');

  // Toolbar Action Triggers
  const btnEncrypt = document.getElementById('btn-encrypt');
  const btnDecrypt = document.getElementById('btn-decrypt');
  const btnSwap = document.getElementById('btn-swap');
  const btnCopy = document.getElementById('btn-copy-output');
  const btnClearAll = document.getElementById('btn-clear-workspace');
  const btnClearHist = document.getElementById('btn-clear-history');
  const toggleKeyBtn = document.getElementById('toggle-key-visibility');

  // Telemetry Dashboard Nodes Markers
  const telStatus = document.getElementById('telemetry-status');
  const telInputSize = document.getElementById('telemetry-input-size');
  const telOutputSize = document.getElementById('telemetry-output-size');
  const telTime = document.getElementById('telemetry-time');
  const historyContainer = document.getElementById('history-list-container');

  // Dictionary containing analytical descriptions for selected algorithms
  const primitiveExplainers = {
    'AES-GCM': 'AES-GCM (Galois/Counter Mode) provides high-performance authenticated symmetric encryption, verifying data integrity alongside privacy constraints.',
    'AES-CBC': 'AES-CBC (Cipher Block Chaining) requires initialization vectors (IV) to render structured block groupings securely but does not include native structural integrity check headers.',
    'Base64-Enc': 'Base64 Encoding converts raw strings into distinct 6-bit alphanumeric printing systems. It acts as simple data format serialization, NOT a cryptographic security structure.',
    'Base64-Dec': 'Reverts 6-bit ASCII printing systems arrays back into baseline normalized raw text variables or strings.',
    'SHA-256': 'SHA-256 generates a fixed 256-bit character payload cryptographic verification hash digest. This calculation sequence is strict, one-way, and irreversible.',
    'SHA-512': 'SHA-512 generates an extended ultra-high security 512-bit string verification footprint digest. Excellent for collision resistance parameters checks.'
  };

  // Sync initial primitive layout state properties tracking channel
  if (algoSelector) {
    algoSelector.addEventListener('change', () => {
      const selectedValue = algoSelector.value;
      algoExplainer.innerText = primitiveExplainers[selectedValue] || '';
      
      // Toggle key interface states depending on selected algorithm vectors parameters boundary requirements
      const requiresKey = selectedValue.startsWith('AES');
      if (secretKey) {
        secretKey.disabled = !requiresKey;
        secretKey.style.opacity = requiresKey ? '1' : '0.4';
        if(!requiresKey) secretKey.value = '';
      }
      if (btnDecrypt) {
        const structuralDecryptionImpossible = selectedValue.startsWith('SHA') || selectedValue === 'Base64-Enc';
        btnDecrypt.disabled = structuralDecryptionImpossible;
        btnDecrypt.style.opacity = structuralDecryptionImpossible ? '0.4' : '1';
      }
    });
    // Fire event to register startup baseline state parameters trace values hooks mappings
    algoSelector.dispatchEvent(new Event('change'));
  }

  // Toggle Password Mask/Unmask visibility mechanics layout interface logic node
  if (toggleKeyBtn && secretKey) {
    toggleKeyBtn.addEventListener('click', () => {
      if (secretKey.type === 'password') {
        secretKey.type = 'text';
        toggleKeyBtn.innerText = '🔒';
      } else {
        secretKey.type = 'password';
        toggleKeyBtn.innerText = '👁️';
      }
    });
  }

  // Action Pipelines Setup Channels bindings
  if (btnEncrypt)  btnEncrypt.addEventListener('click', () => processCryptographicAction('ENCRYPT'));
  if (btnDecrypt)  btnDecrypt.disabled === false && btnDecrypt.addEventListener('click', () => processCryptographicAction('DECRYPT'));
  
  if (btnSwap && textInput && cryptOutput) {
    btnSwap.addEventListener('click', () => {
      const outputVal = cryptOutput.innerText;
      if (!outputVal || outputVal.startsWith('Output') || outputVal.startsWith('Error')) return;
      textInput.value = outputVal;
      cryptOutput.innerText = 'Buffers swapped. Choose transformation process parameters loop...';
      updateTelemetryPanel(outputVal.length, 0, 0, 'IDLE');
    });
  }

  if (btnClearAll && textInput && cryptOutput && secretKey) {
    btnClearAll.addEventListener('click', () => {
      textInput.value = '';
      secretKey.value = '';
      cryptOutput.innerText = 'Workspace environments cleared safely.';
      updateTelemetryPanel(0, 0, 0, 'IDLE');
    });
  }

  if (btnCopy && cryptOutput) {
    btnCopy.addEventListener('click', async () => {
      const textVal = cryptOutput.innerText;
      if (!textVal || textVal.startsWith('Output') || textVal.startsWith('Error')) return;
      try {
        await navigator.clipboard.writeText(textVal);
        const originalText = btnCopy.innerText;
        btnCopy.innerText = '✅ Copied!';
        setTimeout(() => { btnCopy.innerText = originalText; }, 1500);
      } catch (err) { console.error('Failed writing clipboard buffer stream', err); }
    });
  }

  if (btnClearHist) {
    btnClearHist.addEventListener('click', () => {
      localStorage.removeItem('rbeh-crypt-history-vault');
      renderHistoryRecordsUI();
    });
  }

  // Base Lifecycle Render Initialization Call Frame
  renderHistoryRecordsUI();

  /**
   * Main Intercept Routing Operation Management Pipeline Function Node Entry
   */
  async function processCryptographicAction(operationMode) {
    const rawText = textInput.value;
    const passPhrase = secretKey.value;
    const selectedPrimitive = algoSelector.value;

    if (!rawText) {
      displayErrorState('Empty Input Target Text Context Array!');
      return;
    }
    if (selectedPrimitive.startsWith('AES') && !passPhrase) {
      displayErrorState('Selected algorithm requires a valid secret key passphrase vector!');
      return;
    }

    const processStartTime = performance.now();
    updateTelemetryPanel(new Blob([rawText]).size, 0, 0, 'PROCESSING');

    try {
      let finalCalculatedResult = '';
      
      if (operationMode === 'ENCRYPT') {
        outputLabel.innerText = 'Cryptographic Ciphertext Result Output';
        
        switch (selectedPrimitive) {
          case 'Base64-Enc':
            finalCalculatedResult = btoa(unescape(encodeURIComponent(rawText)));
            break;
          case 'SHA-256':
            finalCalculatedResult = await generateOneWayHashDigest(rawText, 'SHA-256');
            break;
          case 'SHA-512':
            finalCalculatedResult = await generateOneWayHashDigest(rawText, 'SHA-512');
            break;
          case 'AES-GCM':
            finalCalculatedResult = await executeSymmetricAESCore(rawText, passPhrase, 'AES-GCM', 'ENCRYPT');
            break;
          case 'AES-CBC':
            finalCalculatedResult = await executeSymmetricAESCore(rawText, passPhrase, 'AES-CBC', 'ENCRYPT');
            break;
          default:
            throw new Error('Unsupported calculation algorithm pathway structure');
        }
      } else {
        // Handle Decryption Processes
        outputLabel.innerText = 'Decrypted Plaintext Output';
        
        switch (selectedPrimitive) {
          case 'Base64-Dec':
            finalCalculatedResult = decodeURIComponent(escape(atob(rawText)));
            break;
          case 'AES-GCM':
            finalCalculatedResult = await executeSymmetricAESCore(rawText, passPhrase, 'AES-GCM', 'DECRYPT');
            break;
          case 'AES-CBC':
            finalCalculatedResult = await executeSymmetricAESCore(rawText, passPhrase, 'AES-CBC', 'DECRYPT');
            break;
          default:
            throw new Error('Decryption calculation mapping parameter failure.');
        }
      }

      const processEndTime = performance.now();
      const executionDuration = processEndTime - processStartTime;
      const outSize = new Blob([finalCalculatedResult]).size;

      cryptOutput.innerText = finalCalculatedResult;
      cryptOutput.style.color = 'inherit';
      
      updateTelemetryPanel(new Blob([rawText]).size, outSize, executionDuration, 'COMPLETED');
      pushToLocalHistoryRegistry(selectedPrimitive, operationMode);

    } catch (error) {
      console.error(error);
      displayErrorState(error.message || 'Cryptographic Calculation Operation Trap Exception');
    }
  }

  /**
   * Browser Native Crypto Subsystem Key Derivation and AES Processing Engine Nodes
   */
  async function executeSymmetricAESCore(textData, keyPhrase, algorithmName, directionMode) {
    const textEncoderInstance = new TextEncoder();
    const keyBufferDataBytes = textEncoderInstance.encode(keyPhrase);
    
    // Convert baseline password string into a raw foundational Key Object element framework link
    const baseKeyStructure = await window.crypto.subtle.importKey(
      'raw', keyBufferDataBytes, { name: 'PBKDF2' }, false, ['deriveKey']
    );

    // Salting bounds settings parameters mappings allocations track channels arrays bounds
    const genericStaticSaltBytes = textEncoderInstance.encode('RBEH-Multiverse-Crypto-Salt-Vector');
    
    // Derive high-entropy AES key structure from the underlying raw key buffer configuration
    const computedAESKeyMaterial = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: genericStaticSaltBytes,
        iterations: 60000,
        hash: 'SHA-256'
      },
      baseKeyStructure,
      { name: algorithmName, length: 256 },
      false,
      directionMode === 'ENCRYPT' ? ['encrypt', 'decrypt'] : ['decrypt']
    );

    // Initialization Vectors Requirements allocation parameters tracks logic mappings structures
    const ivLength = algorithmName === 'AES-GCM' ? 12 : 16;

    if (directionMode === 'ENCRYPT') {
      const initializationVectorBytes = window.crypto.getRandomValues(new Uint8Array(ivLength));
      const textPlainDataBytes = textEncoderInstance.encode(textData);

      const rawEncryptedBytesBuffer = await window.crypto.subtle.encrypt(
        { name: algorithmName, iv: initializationVectorBytes },
        computedAESKeyMaterial,
        textPlainDataBytes
      );

      // Package initialization vectors along with the ciphertext array to allow transport layers mapping resolution data bounds blocks
      const packedResultArray = new Uint8Array(initializationVectorBytes.length + rawEncryptedBytesBuffer.byteLength);
      packedResultArray.set(initializationVectorBytes, 0);
      packedResultArray.set(new Uint8Array(rawEncryptedBytesBuffer), initializationVectorBytes.length);

      // Return unified safe Base64 string payload layout
      return btoa(String.fromCharCode.apply(null, packedResultArray));
    } else {
      // Decode base Base64 wrapper configuration string values
      let binaryPackedStringData = '';
      try {
        binaryPackedStringData = atob(textData);
      } catch(e) {
        throw new Error('Invalid Ciphertext Format: Text payload contains invalid Base64 structures characters symbols mappings!');
      }

      const packedDataBytesArray = new Uint8Array(binaryPackedStringData.length);
      for (let i = 0; i < binaryPackedStringData.length; i++) {
        packedDataBytesArray[i] = binaryPackedStringData.charCodeAt(i);
      }

      if (packedDataBytesArray.length <= ivLength) {
        throw new Error('Ciphertext allocation boundaries trace parameter array layout error. Struct token empty or corrupted!');
      }

      // Slice initialization components from data context layers structures tracks mapping channels components arrays
      const extractedIVBytes = packedDataBytesArray.slice(0, ivLength);
      const extractedCipherDataPayloadBytes = packedDataBytesArray.slice(ivLength);

      try {
        const plainTextBytesBuffer = await window.crypto.subtle.decrypt(
          { name: algorithmName, iv: extractedIVBytes },
          computedAESKeyMaterial,
          extractedCipherDataPayloadBytes
        );
        return new TextDecoder().decode(plainTextBytesBuffer);
      } catch (decryptionError) {
        throw new Error('Decryption Failed! Bad parameters matches, incorrect key value configuration sequence, or payload corruption detected!');
      }
    }
  }

  /**
   * Safe One-Way Alphanumeric Digest Hashes Calculator Framework Function Link Component Node
   */
  async function generateOneWayHashDigest(messageText, variantName) {
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(messageText);
    const hashBufferBytesResult = await window.crypto.subtle.digest(variantName, dataBytes);
    
    // Map output array structure into hex tracking representations parameters values structures
    const hashArrayResultBytes = Array.from(new Uint8Array(hashBufferBytesResult));
    return hashArrayResultBytes.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function updateTelemetryPanel(inputB, outputB, elapsedMs, statusStr) {
    if (telStatus) telStatus.innerText = statusStr;
    if (telInputSize) telInputSize.innerText = `${inputB} Bytes`;
    if (telOutputSize) telOutputSize.innerText = `${outputB} Bytes`;
    if (telTime) telTime.innerText = `${elapsedMs.toFixed(2)} ms`;
  }

  function displayErrorState(errorMessageText) {
    if (cryptOutput) {
      cryptOutput.innerText = `⚠️ Error Execution Block Fault: ${errorMessageText}`;
      cryptOutput.style.color = '#e8312f';
    }
    updateTelemetryPanel(0, 0, 0, 'FAULT');
  }

  function pushToLocalHistoryRegistry(algoType, operationType) {
    let currentVaultRecordsList = JSON.parse(localStorage.getItem('rbeh-crypt-history-vault') || '[]');
    const recordPayload = {
      algo: algoType,
      op: operationType,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    currentVaultRecordsList.unshift(recordPayload);
    if (currentVaultRecordsList.length > 10) currentVaultRecordsList = currentVaultRecordsList.slice(0, 10);
    localStorage.setItem('rbeh-crypt-history-vault', JSON.stringify(currentVaultRecordsList));
    renderHistoryRecordsUI();
  }

  function renderHistoryRecordsUI() {
    if (!historyContainer) return;
    const historyList = JSON.parse(localStorage.getItem('rbeh-crypt-history-vault') || '[]');

    if (historyList.length === 0) {
      historyContainer.innerHTML = `<div style="font-size: 12px; opacity: 0.5; padding: 20px 0; text-align: center;">No local calculations recorded in this environment window lifetime.</div>`;
      return;
    }

    historyContainer.innerHTML = '';
    historyList.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'history-card-node';
      card.style.display = 'flex';
      card.style.justifyContent = 'space-between';
      card.style.alignItems = 'center';
      card.innerHTML = `
        <div>
          <strong>${item.algo}</strong> 
          <span style="opacity:0.6; font-size:11px; margin-left:6px; padding: 2px 6px; background:rgba(0,0,0,0.05); border-radius:4px;">${item.op}</span>
        </div>
        <div style="font-size:11px; opacity:0.5;">${item.time}</div>
      `;
      historyContainer.appendChild(card);
    });
  }
});