/**
 * api/file-encryption.js
 * High-Throughput Client-Side Cryptographic File Sandbox
 * Web Crypto Core API Integration Matrix - RBEH Multiverse Web System
 */

document.addEventListener('DOMContentLoaded', () => {
  // Drag-and-drop structural node channels bindings targets
  const dropZone = document.getElementById('drop-zone');
  const hiddenFileInput = document.getElementById('file-hidden-input');
  const dropPromptView = document.getElementById('drop-zone-prompt-view');
  const dropMetaView = document.getElementById('drop-zone-meta-view');
  
  const subActionsPanel = document.getElementById('file-sub-actions');
  const btnSelectAnother = document.getElementById('btn-select-another');
  const btnRemoveFile = document.getElementById('btn-remove-file');

  // Encryption Keys validation buffers input slots DOM references elements markers
  const keyMain = document.getElementById('secret-key-main');
  const keyConfirm = document.getElementById('secret-key-confirm');
  const toggleMain = document.getElementById('toggle-key-main');
  const toggleConfirm = document.getElementById('toggle-key-confirm');
  
  const algoDropdown = document.getElementById('algo-selection-dropdown');
  const algoShortExplainer = document.getElementById('algo-short-explainer');

  // Processing, progress track frames components DOM references targets
  const btnEncryptTrigger = document.getElementById('btn-trigger-encrypt');
  const btnDecryptTrigger = document.getElementById('btn-trigger-decrypt');
  const processStagePanel = document.getElementById('processing-stage-node');
  const progressStrLbl = document.getElementById('progress-status-string-lbl');
  const progressPercentLbl = document.getElementById('progress-percent-val-lbl');
  const progressBarFill = document.getElementById('progress-bar-fill');
  const errorBoundaryCard = document.getElementById('error-boundary-card');

  // Output card targets DOM parameters
  const outputResultPanel = document.getElementById('output-result-matrix-panel');
  const statusBadgeLbl = document.getElementById('status-badge-lbl');
  const outFileName = document.getElementById('out-file-name');
  const outSizeOrig = document.getElementById('out-size-orig');
  const outSizeMod = document.getElementById('out-size-mod');
  const outAlgoUsed = document.getElementById('out-algo-used');
  const outExecTime = document.getElementById('out-exec-time');
  
  const lnkDownloadTrigger = document.getElementById('lnk-download-trigger');
  const btnCopyMetaInfo = document.getElementById('btn-copy-meta-info');
  const btnClearResult = document.getElementById('btn-clear-result');
  const btnFlushHistory = document.getElementById('btn-flush-history');
  const historyRowsWrapper = document.getElementById('history-rows-wrapper-node');

  // Active state memory trackers pointers indexes values tracking maps arrays
  let selectedFilePayloadReference = null;
  let processedResultBlobPayloadReference = null;
  let compiledTelemetryMetadataString = "";

  const dropdownExplainers = {
    'AES-GCM': 'AES-GCM authenticates payload structural matrices integrity blocks during reverse pipeline mapping loops execution.',
    'AES-CBC': 'AES-CBC operates under sequential initialization vectors block chains tracking parameters. Requires pad blocks, lacks native validation headers tags.'
  };

  // Bind dropdown description modifications trackers loops channels paths mappings structures
  if (algoDropdown) {
    algoDropdown.addEventListener('change', () => {
      if (algoShortExplainer) algoShortExplainer.innerText = dropdownExplainers[algoDropdown.value] || '';
    });
  }

  // Handle password mask view toggles mapping parameters mechanics
  setupMaskToggleTrigger(toggleMain, keyMain);
  setupMaskToggleTrigger(toggleConfirm, keyConfirm);

  function setupMaskToggleTrigger(btnNode, targetField) {
    if (btnNode && targetField) {
      btnNode.addEventListener('click', () => {
        if (targetField.type === 'password') {
          targetField.type = 'text';
          btnNode.innerText = '🔒';
        } else {
          targetField.type = 'password';
          btnNode.innerText = '👁️';
        }
      });
    }
  }

  // Drag and Drop active loop triggers handling boundaries matrices layers parameters
  if (dropZone) {
    dropZone.addEventListener('click', () => hiddenFileInput && hiddenFileInput.click());
    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        registerSelectedFileReferencePayload(e.dataTransfer.files[0]);
      }
    });
  }

  if (hiddenFileInput) {
    hiddenFileInput.addEventListener('change', () => {
      if (hiddenFileInput.files && hiddenFileInput.files.length > 0) {
        registerSelectedFileReferencePayload(hiddenFileInput.files[0]);
      }
    });
  }

  if (btnSelectAnother) btnSelectAnother.addEventListener('click', () => hiddenFileInput && hiddenFileInput.click());
  if (btnRemoveFile) btnRemoveFile.addEventListener('click', () => purgeLoadedFilePipelineStreamState());
  if (btnClearResult) btnClearResult.addEventListener('click', () => clearResultDisplayContextElementsNode());

  if (btnEncryptTrigger) btnEncryptTrigger.addEventListener('click', () => executeCryptActionRouter('ENCRYPT'));
  if (btnDecryptTrigger) btnDecryptTrigger.addEventListener('click', () => executeCryptActionRouter('DECRYPT'));

  if (btnFlushHistory) {
    btnFlushHistory.addEventListener('click', () => {
      localStorage.removeItem('rbeh-file-crypt-history-vault');
      renderHistoryLogRegistryUI();
    });
  }

  if (btnCopyMetaInfo) {
    btnCopyMetaInfo.addEventListener('click', async () => {
      if (!compiledTelemetryMetadataString) return;
      try {
        await navigator.clipboard.writeText(compiledTelemetryMetadataString);
        const baseTxt = btnCopyMetaInfo.innerText;
        btnCopyMetaInfo.innerText = "✅ Telemetry Copied!";
        setTimeout(() => { btnCopyMetaInfo.innerText = baseTxt; }, 1500);
      } catch (err) {}
    });
  }

  // Startup lifecycle trace baseline loading arrays configurations systems
  renderHistoryLogRegistryUI();

  /**
   * Safe Data Core Payload Mapping Pipeline Initialization Node Functions
   */
  function registerSelectedFileReferencePayload(fileObj) {
    if (!fileObj) return;
    selectedFilePayloadReference = fileObj;
    
    document.getElementById('meta-file-name').innerText = `Target Array: ${fileObj.name}`;
    document.getElementById('meta-file-size').innerText = formatBytesAllocationDisplayUnitMetric(fileObj.size);
    document.getElementById('meta-file-type').innerText = fileObj.type || "binary/octet-stream (Undefined Profile)";
    
    if (dropPromptView) dropPromptView.style.display = 'none';
    if (dropMetaView) dropMetaView.style.display = 'block';
    if (subActionsPanel) subActionsPanel.style.display = 'flex';
    if (errorBoundaryCard) errorBoundaryCard.style.display = 'none';
  }

  function purgeLoadedFilePipelineStreamState() {
    selectedFilePayloadReference = null;
    if (hiddenFileInput) hiddenFileInput.value = '';
    if (dropPromptView) dropPromptView.style.display = 'block';
    if (dropMetaView) dropMetaView.style.display = 'none';
    if (subActionsPanel) subActionsPanel.style.display = 'none';
    clearResultDisplayContextElementsNode();
  }

  function clearResultDisplayContextElementsNode() {
    processedResultBlobPayloadReference = null;
    compiledTelemetryMetadataString = "";
    if (outputResultPanel) outputResultPanel.style.display = 'none';
    if (errorBoundaryCard) errorBoundaryCard.style.display = 'none';
    if (processStagePanel) processStagePanel.style.display = 'none';
  }

  /**
   * Main Dynamic Engine Interceptor Matrix Process Handler Strategy Allocation Controller Function Entry Point
   */
  async function executeCryptActionRouter(operationType) {
    if (!selectedFilePayloadReference) { displayErrorState("No File Selected! Please map an array node inside target container."); return; }
    
    const keyValStr = keyMain.value;
    const confirmValStr = keyConfirm.value;
    const chosenAlgorithm = algoDropdown.value;

    if (!keyValStr) { displayErrorState("Empty Password Fields! Execution requires an authorized processing state passphrase block key."); return; }
    if (operationType === 'ENCRYPT' && keyValStr !== confirmValStr) { displayErrorState("Password Mismatch! Validation key sets values mismatch."); return; }

    // Toggle runtime operational progress indicators panel layouts frames components elements
    if (errorBoundaryCard) errorBoundaryCard.style.display = 'none';
    if (outputResultPanel) outputResultPanel.style.display = 'none';
    if (processStagePanel) processStagePanel.style.display = 'block';

    updateLiveProgressBarTrackState(10, operationType === 'ENCRYPT' ? "Preparing Encryption... Reading Array Binary Blocks Data" : "Preparing Decryption... Reading Array Binary Blocks Data");

    const runtimeStartTimeMarker = performance.now();

    // Use FileReader logic allocation strategy pipeline channel model array structure stream block
    const fileContentReaderInstance = new FileReader();
    
    fileContentReaderInstance.onload = async (event) => {
      try {
        const fileRawArrayBuffer = event.target.result;
        updateLiveProgressBarTrackState(45, operationType === 'ENCRYPT' ? "Encrypting Chunks... Dispatching Cryptographic Crypto Subsystem Thread" : "Decrypting Chunks... Dispatching Cryptographic Crypto Subsystem Thread");

        let processedBufferResult = null;

        if (operationType === 'ENCRYPT') {
          processedBufferResult = await executeSymmetricWebCryptoFileCore(fileRawArrayBuffer, keyValStr, chosenAlgorithm, 'ENCRYPT');
        } else {
          processedBufferResult = await executeSymmetricWebCryptoFileCore(fileRawArrayBuffer, keyValStr, chosenAlgorithm, 'DECRYPT');
        }

        updateLiveProgressBarTrackState(85, "Generating Secure File Output Stream Blocks Structure Assemblies...");

        // Build file wrapper construct blob target pipeline structure mapping context configurations nodes targets elements components properties
        let finalExportedFileNameString = "";
        let finalMimeTypeMappingStr = "";

        if (operationType === 'ENCRYPT') {
          finalExportedFileNameString = selectedFilePayloadReference.name + ".enc";
          finalMimeTypeMappingStr = "application/octet-stream";
        } else {
          // Revert file string target configurations array properties variables references parameters names
          finalExportedFileNameString = selectedFilePayloadReference.name.replace(/\.enc$/i, '');
          if (finalExportedFileNameString === selectedFilePayloadReference.name) {
            finalExportedFileNameString = "decrypted_" + selectedFilePayloadReference.name;
          }
          finalMimeTypeMappingStr = "application/octet-stream"; 
        }

        processedResultBlobPayloadReference = new Blob([processedBufferResult], { type: finalMimeTypeMappingStr });
        
        const runtimeEndTimeMarker = performance.now();
        const absoluteDeltaCalculationTimeDuration = runtimeEndTimeMarker - runtimeStartTimeMarker;

        // Render success validation target metrics states
        updateLiveProgressBarTrackState(100, "Ready for Download... Memory operations synchronized safely.");
        displayCalculationResultOutputsUI(operationType, finalExportedFileNameString, chosenAlgorithm, absoluteDeltaCalculationTimeDuration);

      } catch (err) {
        console.error(err);
        displayErrorState(err.message || "Cryptographical Core Execution Loop Failure Trap Trace Signal Error!");
      }
    };

    fileContentReaderInstance.onerror = () => displayErrorState("File IO Access Fault: Critical boundary read parameters tracking restriction error.");
    fileContentReaderInstance.readAsArrayBuffer(selectedFilePayloadReference);
  }

  /**
   * Browser Structural Low-Level Cryptographical Interface Mapping Engine Functions Layers Primitives
   */
  async function executeSymmetricWebCryptoFileCore(inputBuffer, passwordPhrase, algorithmName, directionMode) {
    const textEncoderInstance = new TextEncoder();
    const passphraseBytesBuffer = textEncoderInstance.encode(passwordPhrase);

    // Import baseline passphrase to serve as initial structural material trace loop parameters key token allocation layout
    const basePasswordKeyMaterial = await window.crypto.subtle.importKey(
      'raw', passphraseBytesBuffer, { name: 'PBKDF2' }, false, ['deriveKey']
    );

    // Derive deterministic high-entropy encryption keys tracking pointers maps nodes arrays layers parameters matrix salt array constants markers
    const hardcodedSaltBytesMarker = textEncoderInstance.encode('RBEH-Multiverse-File-Core-Salt-Matrix');
    
    const derivedSymmetricKeyObject = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: hardcodedSaltBytesMarker,
        iterations: 70000,
        hash: 'SHA-256'
      },
      basePasswordKeyMaterial,
      { name: algorithmName, length: 256 },
      false,
      directionMode === 'ENCRYPT' ? ['encrypt', 'decrypt'] : ['decrypt']
    );

    const initializationVectorSize = algorithmName === 'AES-GCM' ? 12 : 16;

    if (directionMode === 'ENCRYPT') {
      const cryptoInitializationVectorBytes = window.crypto.getRandomValues(new Uint8Array(initializationVectorSize));
      
      const cipherDataPayloadBuffer = await window.crypto.subtle.encrypt(
        { name: algorithmName, iv: cryptoInitializationVectorBytes },
        derivedSymmetricKeyObject,
        inputBuffer
      );

      // Consolidate package payloads structures array memory footprint alignments tracks systems
      const dynamicUnifiedExportArrayBuffer = new Uint8Array(cryptoInitializationVectorBytes.length + cipherDataPayloadBuffer.byteLength);
      dynamicUnifiedExportArrayBuffer.set(cryptoInitializationVectorBytes, 0);
      dynamicUnifiedExportArrayBuffer.set(new Uint8Array(cipherDataPayloadBuffer), cryptoInitializationVectorBytes.length);

      return dynamicUnifiedExportArrayBuffer.buffer;
    } else {
      // Decode initialization payload vectors array streams components properties targets mappings structures
      const fullPackedBytesArrayView = new Uint8Array(inputBuffer);
      
      if (fullPackedBytesArrayView.length <= initializationVectorSize) {
        throw new Error("Ciphertext binary sequence under-allocated boundary failure limits error. String token damaged or fragmented!");
      }

      const extractedIVBytesBlock = fullPackedBytesArrayView.slice(0, initializationVectorSize);
      const extractedCiphertextPayloadBytesBlock = fullPackedBytesArrayView.slice(initializationVectorSize);

      try {
        return await window.crypto.subtle.decrypt(
          { name: algorithmName, iv: extractedIVBytesBlock },
          derivedSymmetricKeyObject,
          extractedCiphertextPayloadBytesBlock
        );
      } catch (decryptionSubsystemError) {
        throw new Error("Decryption Failed! Invalid security keys, corrupted package matrix headers tags, or data integrity bounds verification failed!");
      }
    }
  }

  function updateLiveProgressBarTrackState(percentVal, statusString) {
    if (progressBarFill) progressBarFill.style.width = `${percentVal}%`;
    if (progressPercentLbl) progressPercentLbl.innerText = `${percentVal}%`;
    if (progressStrLbl) progressStrLbl.innerText = statusString;
  }

  function displayErrorState(errorMessage) {
    if (errorBoundaryCard) {
      errorBoundaryCard.innerText = `⚠️ Action Block Intercept Fault: ${errorMessage}`;
      errorBoundaryCard.style.display = 'block';
    }
    if (processStagePanel) processStagePanel.style.display = 'none';
    if (outputResultPanel) outputResultPanel.style.display = 'none';
  }

  function displayCalculationResultOutputsUI(mode, filename, algo, elapsedMs) {
    if (processStagePanel) processStagePanel.style.display = 'none';
    if (!outputResultPanel) return;

    outputResultPanel.style.display = 'block';
    
    const isEnc = mode === 'ENCRYPT';
    if (statusBadgeLbl) {
      statusBadgeLbl.innerText = isEnc ? "🟢 Encryption Complete" : "🟢 Decryption Complete";
      statusBadgeLbl.style.background = isEnc ? "rgba(31,167,90,0.1)" : "rgba(31,167,90,0.1)";
      statusBadgeLbl.style.color = isEnc ? "#1fa75a" : "#1fa75a";
    }

    if (outFileName) outFileName.innerText = filename;
    if (outSizeOrig) outSizeOrig.innerText = formatBytesAllocationDisplayUnitMetric(selectedFilePayloadReference.size);
    if (outSizeMod)  outSizeMod.innerText = formatBytesAllocationDisplayUnitMetric(processedResultBlobPayloadReference.size);
    if (outAlgoUsed) outAlgoUsed.innerText = `${algo} (256-bit Key)`;
    if (outExecTime) outExecTime.innerText = `${elapsedMs.toFixed(1)} ms`;

    // Map dynamic temporary execution path link reference loop component target file downloader anchor structure properties tracking
    const runtimeObjectURL = URL.createObjectURL(processedResultBlobPayloadReference);
    if (lnkDownloadTrigger) {
      lnkDownloadTrigger.href = runtimeObjectURL;
      lnkDownloadTrigger.download = filename;
      lnkDownloadTrigger.innerText = isEnc ? "⬇ Download Encrypted File" : "⬇ Download Decrypted File";
    }

    // Build clipboard string template format mapping arrays targets elements
    compiledTelemetryMetadataString = `--- RBEH MULTIVERSE SYSTEM FILE ANALYSIS REGISTRY LOG ---
Operation: ${mode} Transformation Sequence
Target File Identifier: ${filename}
Algorithm Block Primitive: ${algo} Core Engine Module Standard Base Key Track
Original Payload Structural Magnitude: ${selectedFilePayloadReference.size} Bytes
Processed Output Footprint Dimension: ${processedResultBlobPayloadReference.size} Bytes
Hardware Execution Thread Response Window: ${elapsedMs.toFixed(2)} ms
File Integrity Validation Verification Track Layer Check: Safe (Client-Side Calculated)
Timestamp Session Epoch Sync Sequence Code Marker: 2026-MARKER-BOUNDS`;

    pushToLocalHistoryVaultLogs(selectedFilePayloadReference.name, mode, selectedFilePayloadReference.size);
  }

  function formatBytesAllocationDisplayUnitMetric(bytesCount) {
    if (bytesCount === 0) return '0 Bytes';
    const sizingKiloMetricSystemBase = 1024;
    const arrayPrecisionIndexMarkersLabels = ['Bytes', 'KB', 'MB', 'GB'];
    const matchingExponentCalculationTierIndex = Math.floor(Math.log(bytesCount) / Math.log(sizingKiloMetricSystemBase));
    return parseFloat((bytesCount / Math.pow(sizingKiloMetricSystemBase, matchingExponentCalculationTierIndex)).toFixed(2)) + ' ' + arrayPrecisionIndexMarkersLabels[matchingExponentCalculationTierIndex];
  }

  function pushToLocalHistoryVaultLogs(name, operationType, size) {
    let currentHistoryStack = JSON.parse(localStorage.getItem('rbeh-file-crypt-history-vault') || '[]');
    
    const recordRowPayload = {
      name: name,
      op: operationType,
      size: formatBytesAllocationDisplayUnitMetric(size),
      timestamp: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    currentHistoryStack.unshift(recordRowPayload);
    if (currentHistoryStack.length > 10) currentHistoryStack = currentHistoryStack.slice(0, 10);
    localStorage.setItem('rbeh-file-crypt-history-vault', JSON.stringify(currentHistoryStack));
    renderHistoryLogRegistryUI();
  }

  function renderHistoryLogRegistryUI() {
    if (!historyRowsWrapper) return;
    const systemsArrayDataLogsList = JSON.parse(localStorage.getItem('rbeh-file-crypt-history-vault') || '[]');

    if (systemsArrayDataLogsList.length === 0) {
      historyRowsWrapper.innerHTML = `<div style="font-size: 12px; opacity: 0.5; padding: 20px 0; text-align: center;">No file arrays mapped inside browser transaction boundaries.</div>`;
      return;
    }

    historyRowsWrapper.innerHTML = '';
    systemsArrayDataLogsList.forEach((item) => {
      const itemRowDiv = document.createElement('div');
      itemRowDiv.className = 'history-item-row';
      itemRowDiv.innerHTML = `
        <div style="font-weight:700; word-break:break-all;">${item.name}</div>
        <div style="display:flex; justify-content:space-between; align-items:center; opacity:0.6; font-size:11px; margin-top:2px;">
          <span>Type: <strong>${item.op}</strong> (${item.size})</span>
          <span>${item.timestamp}</span>
        </div>
      `;
      historyRowsWrapper.appendChild(itemRowDiv);
    });
  }
});