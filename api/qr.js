/**
 * api/qr.js
 * Hybrid Client-Side Heuristics QR Scanner & Detector Subsystem
 * Unified Cross-Module API Integrations Matrix - RBEH Multiverse Web Core Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Input Selection Tab Element Array Nodes Mappings
  const tabUpload = document.getElementById('tab-trigger-upload');
  const tabCamera = document.getElementById('tab-trigger-camera');
  const tabPaste = document.getElementById('tab-trigger-paste');

  const secUpload = document.getElementById('section-view-upload');
  const secCamera = document.getElementById('section-view-camera');
  const secPaste = document.getElementById('section-view-paste');

  // Input Targets Core DOM Entities
  const qrDragContainer = document.getElementById('qr-drag-container');
  const qrFileInput = document.getElementById('qr-file-input');
  const qrPreviewWrapper = document.getElementById('qr-upload-preview-wrapper');
  const qrPreviewImg = document.getElementById('qr-preview-img');
  
  const cameraFeedStream = document.getElementById('camera-feed-stream');
  const cameraStatusTag = document.getElementById('camera-status-tag');
  const btnCamStart = document.getElementById('btn-camera-start');
  const btnCamStop = document.getElementById('btn-camera-stop');
  
  const pasteInputData = document.getElementById('paste-input-data');
  const btnExecuteAnalysis = document.getElementById('btn-execute-analysis');

  // Feedback, Loading Indicators & Reporting Elements Channels
  const loadingStage = document.getElementById('loading-stage-indicator');
  const loadingTxtLbl = document.getElementById('loading-txt-lbl');
  const errorPresentation = document.getElementById('error-presentation-card');
  const dashboardResultPanel = document.getElementById('dashboard-result-panel');

  // Dashboard Node Values Fields Targets
  const verdictBanner = document.getElementById('verdict-banner');
  const dashQrType = document.getElementById('dash-qr-type');
  const dashManualScore = document.getElementById('dash-manual-score');
  const dashVtScore = document.getElementById('dash-vt-score');
  const dashHttpsStatus = document.getElementById('dash-https-status');
  const dashDecodedRaw = document.getElementById('dash-decoded-raw');
  const dashDestinationUrl = document.getElementById('dash-destination-url');
  const dashRecBlock = document.getElementById('dash-recommendation-block');

  // Dynamic Dashboard Control Triggers
  const btnCopyAll = document.getElementById('btn-action-copy-all');
  const btnCopyUrl = document.getElementById('btn-action-copy-url');
  const btnOpenUrl = document.getElementById('btn-action-open-url');
  const btnActionReset = document.getElementById('btn-action-reset');
  const btnFlushQrHist = document.getElementById('btn-flush-qr-history');
  const historyQrScroller = document.getElementById('history-qr-scroller');

  // Active Memory Execution Runtime States
  let targetedActiveInputTabStr = 'UPLOAD';
  let activeLocalCameraMediaStream = null;
  let activeCameraDecodingAnimationFrameLoop = null;
  let decodedPayloadStringDataValue = '';
  let localizedCalculatedResultStringBlob = '';

  /**
   * Layout Interface Selection Tab Synchronization Controls Logic Setup Block
   */
  if(tabUpload) tabUpload.addEventListener('click', () => switchInputWorkflowEnvironment('UPLOAD'));
  if(tabCamera) tabCamera.addEventListener('click', () => switchInputWorkflowEnvironment('CAMERA'));
  if(tabPaste)  tabPaste.addEventListener('click', () => switchInputWorkflowEnvironment('PASTE'));

  function switchInputWorkflowEnvironment(targetEnvStr) {
    targetedActiveInputTabStr = targetEnvStr;
    errorPresentation.style.display = 'none';
    
    [tabUpload, tabCamera, tabPaste].forEach(t => t && t.classList.remove('active-slot'));
    [secUpload, secCamera, secPaste].forEach(s => s && (s.style.display = 'none'));

    if(targetEnvStr === 'UPLOAD') {
      tabUpload.classList.add('active-slot');
      secUpload.style.display = 'block';
      shutdownCameraHardwarePipelineThreads();
    } else if(targetEnvStr === 'CAMERA') {
      tabCamera.classList.add('active-slot');
      secCamera.style.display = 'block';
    } else if(targetEnvStr === 'PASTE') {
      tabPaste.classList.add('active-slot');
      secPaste.style.display = 'block';
      shutdownCameraHardwarePipelineThreads();
    }
  }

  // File Upload Processing Triggers
  if(qrDragContainer) {
    qrDragContainer.addEventListener('click', () => qrFileInput && qrFileInput.click());
    qrDragContainer.addEventListener('dragover', (e) => { e.preventDefault(); qrDragContainer.classList.add('drag-over'); });
    qrDragContainer.addEventListener('dragleave', () => qrDragContainer.classList.remove('drag-over'));
    qrDragContainer.addEventListener('drop', (e) => {
      e.preventDefault();
      qrDragContainer.classList.remove('drag-over');
      if(e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processUploadedImageFileBuffer(e.dataTransfer.files[0]);
      }
    });
  }

  if(qrFileInput) {
    qrFileInput.addEventListener('change', () => {
      if(qrFileInput.files && qrFileInput.files.length > 0) {
        processUploadedImageFileBuffer(qrFileInput.files[0]);
      }
    });
  }

  function processUploadedImageFileBuffer(fileObj) {
    if(!fileObj.type.startsWith('image/')) {
      displayErrorState("Invalid QR Image format! Please supply an asset matching image mime-types.");
      return;
    }
    errorPresentation.style.display = 'none';
    const reader = new FileReader();
    reader.onload = (e) => {
      qrPreviewImg.src = e.target.result;
      qrPreviewWrapper.style.display = 'block';
    };
    reader.readAsDataURL(fileObj);
  }

  /**
   * Browser Live WebCam Capture Execution Mapping Methods
   */
  if(btnCamStart) btnCamStart.addEventListener('click', () => initializeWebcamFeedChannel());
  if(btnCamStop)  btnCamStop.addEventListener('click', () => shutdownCameraHardwarePipelineThreads());

  async function initializeWebcamFeedChannel() {
    errorPresentation.style.display = 'none';
    try {
      activeLocalCameraMediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      cameraFeedStream.srcObject = activeLocalCameraMediaStream;
      cameraStatusTag.innerText = "ACTIVE CAPTURING VIDEO STREAM";
      cameraStatusTag.style.background = "#1fa75a";
      
      // Spawn low-latency frame loop analysis pipeline pass chunk thread mapping
      activeCameraDecodingAnimationFrameLoop = requestAnimationFrame(scanCameraBufferFrameLoopTick);
    } catch (err) {
      displayErrorState("Camera Permission Denied or Device Matrix Busy. Cannot attach video canvas capture stream.");
    }
  }

  function shutdownCameraHardwarePipelineThreads() {
    if(activeCameraDecodingAnimationFrameLoop) {
      cancelAnimationFrame(activeCameraDecodingAnimationFrameLoop);
      activeCameraDecodingAnimationFrameLoop = null;
    }
    if(activeLocalCameraMediaStream) {
      activeLocalCameraMediaStream.getTracks().forEach(track => track.stop());
      activeLocalCameraMediaStream = null;
    }
    if(cameraFeedStream) cameraFeedStream.srcObject = null;
    if(cameraStatusTag) {
      cameraStatusTag.innerText = "CAMERA IDLE";
      cameraStatusTag.style.background = "rgba(0,0,0,0.6)";
    }
  }

  async function scanCameraBufferFrameLoopTick() {
    if (cameraFeedStream && cameraFeedStream.readyState === cameraFeedStream.HAVE_CURRENT_DATA) {
      const canvas = document.createElement('canvas');
      canvas.width = cameraFeedStream.videoWidth;
      canvas.height = cameraFeedStream.videoHeight;
      const ctx2d = canvas.getContext('2d');
      ctx2d.drawImage(cameraFeedStream, 0, 0, canvas.width, canvas.height);
      const imgData = ctx2d.getImageData(0, 0, canvas.width, canvas.height);
      
      // Pass the raw image matrix chunk bytes buffer downstream straight into jsQR decoder boundary sandbox
      const code = jsQR(imgData.data, imgData.width, imgData.height, { inversionAttempts: "dontInvert" });
      
      if(code && code.data) {
        shutdownCameraHardwarePipelineThreads();
        processDecodedContentRoutingString(code.data);
        return;
      }
    }
    if(activeLocalCameraMediaStream) {
      activeCameraDecodingAnimationFrameLoop = requestAnimationFrame(scanCameraBufferFrameLoopTick);
    }
  }

  /**
   * Action Router Dispatch Engine Execution Matrix Management Hooks Mapping Pipeline
   */
  if(btnExecuteAnalysis) {
    btnExecuteAnalysis.addEventListener('click', () => {
      if(targetedActiveInputTabStr === 'UPLOAD') {
        if(!qrPreviewImg.src) { displayErrorState("No QR Image Detected! Drag an asset before launching security verification sequences."); return; }
        decodeImageElementMatrix(qrPreviewImg);
      } else if(targetedActiveInputTabStr === 'PASTE') {
        const rawPastedVal = pasteInputData.value.trim();
        if(!rawPastedVal) { displayErrorState("Empty Input! Paste valid strings data to analyze properties vectors."); return; }
        processDecodedContentRoutingString(rawPastedVal);
      } else if(targetedActiveInputTabStr === 'CAMERA') {
        displayErrorState("Scanning framework is actively pooling. Point webcam straight at an accessible clear static QR code symbol.");
      }
    });
  }

  function decodeImageElementMatrix(imgElementReference) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const imageInstance = new Image();
    imageInstance.crossOrigin = "Anonymous";
    imageInstance.src = imgElementReference.src;
    
    imageInstance.onload = () => {
      canvas.width = imageInstance.width;
      canvas.height = imageInstance.height;
      ctx.drawImage(imageInstance, 0, 0);
      try {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imgData.data, imgData.width, imgData.height);
        if(code && code.data) {
          processDecodedContentRoutingString(code.data);
        } else {
          displayErrorState("Unsupported QR Format or Invalid QR Image! Unable to resolve anchor boundaries tracking blocks mappings.");
        }
      } catch(e) {
        displayErrorState("Image memory canvas protection trap violation block exception. Scan local data vectors.");
      }
    };
  }

  /**
   * Advanced Hybrid Detection Architecture Module Methods Layers
   */
  async function processDecodedContentRoutingString(rawContentString) {
    decodedPayloadStringDataValue = rawContentString;
    errorPresentation.style.display = 'none';
    dashboardResultPanel.style.display = 'none';
    loadingStage.style.display = 'block';

    updateLoadingTextUI("Decoding QR... Reading String Headers Components Matrices");
    await delayThreadExecutionWindow(400);

    // Identify underlying categorization patterns properties
    const calculatedQrTypeLabel = assessQRDataStructureType(rawContentString);
    
    updateLoadingTextUI("Running Security Analysis Heuristic Verification Vectors...");
    const baseManualThreatRiskScore = runManualHeuristicsDataInspectionLoop(rawContentString);
    await delayThreadExecutionWindow(500);

    let extractedURLDestination = '';
    if(calculatedQrTypeLabel === 'Website QR' || rawContentString.startsWith('http://') || rawContentString.startsWith('https://')) {
      extractedURLDestination = extractDomainBoundsFallbackUrlValue(rawContentString);
    }

    let virustotalDetectionsMetrics = null;
    
    // Check for VirusTotal Cross-Module API instances hooks within RBEH framework bounds
    if(extractedURLDestination) {
      updateLoadingTextUI("Connecting to VirusTotal Endpoint Threat Matrices Verification Channels...");
      virustotalDetectionsMetrics = await queryCrossModuleVirusTotalIntegrationStore(extractedURLDestination);
      await delayThreadExecutionWindow(400);
    }

    updateLoadingTextUI("Generating Security Report...");
    await delayThreadExecutionWindow(200);
    
    loadingStage.style.display = 'none';
    renderFinalDashboardAnalyticsFramework(calculatedQrTypeLabel, baseManualThreatRiskScore, extractedURLDestination, virustotalDetectionsMetrics);
  }

  function assessQRDataStructureType(str) {
    const s = str.toLowerCase();
    if(s.startsWith('http://') || s.startsWith('https://')) return 'Website QR';
    if(s.startsWith('upi://') || s.startsWith('bitcoin:') || s.includes('payment') || s.includes('merchant')) return 'Payment QR';
    if(s.startsWith('wifi:')) return 'WiFi QR';
    if(s.startsWith('smsto:') || s.startsWith('sms:')) return 'SMS QR';
    if(s.startsWith('mailto:') || s.includes('subject=')) return 'Email QR';
    if(s.startsWith('begin:vcard') || s.startsWith('begin:icard')) return 'Contact QR';
    return 'Unknown QR Data Matrix';
  }

  function runManualHeuristicsDataInspectionLoop(str) {
    let scoreMultiplierAcc = 0;
    const low = str.toLowerCase();

    // Check transport vector integrity parameter states
    if(low.includes('http://')) scoreMultiplierAcc += 25;
    
    // Check url shortener configurations anomalies
    const shortenersList = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 'buff.ly', 'adf.ly'];
    shortenersList.forEach(srv => { if(low.includes(srv)) scoreMultiplierAcc += 35; });

    // Suspicious keyword definitions matrices mappings arrays elements hooks
    const maliciousKeywords = ['login', 'verify', 'update-banking', 'free-gift', 'claim-reward', 'airdrop', 'secure-wallet', 'telegram-bot'];
    maliciousKeywords.forEach(kw => { if(low.includes(kw)) scoreMultiplierAcc += 30; });

    // Domain structure parameters evaluation
    if((low.match(/\./g) || []).length > 4) scoreMultiplierAcc += 15;
    if(low.includes('@')) scoreMultiplierAcc += 20; // tracking phishing user credentials injections patterns tricks
    if(/[а-я]/i.test(low)) scoreMultiplierAcc += 30; // simple homograph Punycode lookalike scripts vector detection

    // Boundaries compliance ceiling normalization index caps values
    return Math.min(scoreMultiplierAcc, 100);
  }

  function extractDomainBoundsFallbackUrlValue(str) {
    try {
      const match = str.match(/https?:\/\/[^\s]+/i);
      return match ? match[0] : str;
    } catch(e) { return str; }
  }

  /**
   * Reuses the existing VirusTotal integration structure used inside Phishing Link Detector.
   * Leverages LocalStorage fallback states to avoid duplication of API key bindings.
   */
  async function queryCrossModuleVirusTotalIntegrationStore(targetUrl) {
    const rbehSavedApiKeyToken = localStorage.getItem('rbeh-vt-api-key-token') || '';
    if(!rbehSavedApiKeyToken) return null; // Gracefully drop to manual analysis if VT token is unmapped

    try {
      // Clean url parameters to map base endpoint constraints specifications requirements
      const b64Url = btoa(targetUrl).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
      const response = await fetch(`https://www.virustotal.com/api/v3/urls/${b64Url}`, {
        method: 'GET',
        headers: { 'x-apikey': rbehSavedApiKeyToken }
      });
      if(!response.ok) return null;
      const json = await response.json();
      
      const stats = json.data.attributes.last_analysis_stats;
      return {
        malicious: stats.malicious || 0,
        suspicious: stats.suspicious || 0,
        harmless: stats.harmless || 0,
        reputation: json.data.attributes.reputation || 0
      };
    } catch(err) { return null; }
  }

  /**
   * Final Verdict Calculation, UI Presentation & History Framework Layer
   */
  function renderFinalDashboardAnalyticsFramework(typeLabel, manualScore, destinationUrl, vtData) {
    dashQrType.innerText = typeLabel;
    dashManualScore.innerText = `${manualScore} / 100`;
    dashDecodedRaw.innerText = decodedPayloadStringDataValue;
    dashDestinationUrl.innerText = destinationUrl || "No hyperlinks found within text parameters streams.";
    
    // Transport Security Checking Parameter Layers Mappings
    if(destinationUrl) {
      const isHttps = destinationUrl.toLowerCase().startsWith('https://');
      dashHttpsStatus.innerText = isHttps ? "🔒 HTTPS SECURE" : "🔓 HTTP UNENCRYPTED";
      dashHttpsStatus.style.color = isHttps ? "#1fa75a" : "#e8312f";
    } else {
      dashHttpsStatus.innerText = "N/A";
      dashHttpsStatus.style.color = "inherit";
    }

    // VirusTotal Layout Presentation Render mappings
    if(vtData) {
      dashVtScore.innerText = `Malicious: ${vtData.malicious} | Suspicious: ${vtData.suspicious}`;
      dashVtScore.style.color = vtData.malicious > 0 ? "#e8312f" : "#1fa75a";
    } else {
      dashVtScore.innerText = "No Remote Records (Using Heuristics Only)";
      dashVtScore.style.color = "inherit";
    }

    // Dynamic Hybrid Verdict Resolution Weight Calculation Tree Loop Strategy Logic
    let absoluteWeightedRiskFactorIndex = manualScore;
    if(vtData && vtData.malicious > 0) absoluteWeightedRiskFactorIndex += (vtData.malicious * 30);
    
    let classificationString = 'SAFE';
    let themeColorHex = '#1fa75a';
    let recommendationText = "This QR Code appears safe to open. No structural threat markers detected during scanning cycle logs arrays matches.";

    if(absoluteWeightedRiskFactorIndex >= 20 && absoluteWeightedRiskFactorIndex < 45) {
      classificationString = 'LOW RISK';
      themeColorHex = '#f4b400';
      recommendationText = "Verify the destination domain parameters name before continuing parsing execution sequences loops.";
    } else if(absoluteWeightedRiskFactorIndex >= 45 && absoluteWeightedRiskFactorIndex < 75) {
      classificationString = 'SUSPICIOUS';
      themeColorHex = '#ff6d00';
      recommendationText = "Proceed carefully. Confirm the website layout structural identity before entering any high-priority credential records forms information.";
    } else if(absoluteWeightedRiskFactorIndex >= 75) {
      classificationString = 'DANGEROUS';
      themeColorHex = '#e8312f';
      recommendationText = "Do NOT scan or open this QR Code. Never enter passwords, OTPs, banking information or personal data as payload paths indicate threat vectors mappings.";
    }

    // Apply Verdict Status Banner Attributes Real-time rendering configurations elements properties layout styles changes modifications nodes
    verdictBanner.innerText = `${classificationString}`;
    verdictBanner.style.background = `rgba(${hexToRgbValuesArray(themeColorHex)}, 0.12)`;
    verdictBanner.style.color = themeColorHex;
    verdictBanner.style.border = `1px solid ${themeColorHex}`;
    
    dashRecBlock.innerText = recommendationText;
    dashRecBlock.style.borderLeftColor = themeColorHex;

    // Toggle Action Visibility Parameters
    if(destinationUrl && (classificationString === 'SAFE' || classificationString === 'LOW RISK')) {
      btnOpenUrl.href = destinationUrl;
      btnOpenUrl.style.display = 'inline-block';
    } else {
      btnOpenUrl.style.display = 'none';
    }

    // Compile Local Variable Mapping Context Strings elements strings
    localizedCalculatedResultStringBlob = `--- RBEH SYSTEM QR VERIFICATION REPORT ---
QR Type Structure Profile: ${typeLabel}
Threat Factor Level Index Matrix: ${classificationString} (Heuristic Component Delta Score: ${manualScore})
Decoded Core String Array Context: ${decodedPayloadStringDataValue}
Target Routing Destination Node Path: ${destinationUrl || 'None'}`;

    dashboardResultPanel.style.display = 'block';
    
    pushToLocalStorageScanHistory(typeLabel, classificationString);
  }

  // Helper utility translation tools node elements mappings structures parameters
  function hexToRgbValuesArray(hex) {
    const c = hex.replace('#', '');
    const r = parseInt(c.substring(0,2), 16);
    const g = parseInt(c.substring(2,4), 16);
    const b = parseInt(c.substring(4,6), 16);
    return `${r}, ${g}, ${b}`;
  }

  function updateLoadingTextUI(txt) { if(loadingTxtLbl) loadingTxtLbl.innerText = txt; }
  function delayThreadExecutionWindow(ms) { return new Promise(res => setTimeout(res, ms)); }

  function displayErrorState(msg) {
    if(errorPresentation) {
      errorPresentation.innerText = `⚠️ Error Operations Trap Boundary Code Signal: ${msg}`;
      errorPresentation.style.display = 'block';
    }
    loadingStage.style.display = 'none';
    dashboardResultPanel.style.display = 'none';
  }

  /**
   * Local History Persistence Logging Interface Engine Controllers
   */
  function pushToLocalStorageScanHistory(typeStr, threatLevelStr) {
    let traceHistoryQueueList = JSON.parse(localStorage.getItem('rbeh-qr-detector-history-vault') || '[]');
    const historicLogObjectRow = {
      type: typeStr,
      verdict: threatLevelStr,
      time: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    traceHistoryQueueList.unshift(historicLogObjectRow);
    if(traceHistoryQueueList.length > 10) traceHistoryQueueList = traceHistoryQueueList.slice(0, 10);
    localStorage.setItem('rbeh-qr-detector-history-vault', JSON.stringify(traceHistoryQueueList));
    renderHistoryLogRegistryUI();
  }

  function renderHistoryLogRegistryUI() {
    if(!historyQrScroller) return;
    const historyStackList = JSON.parse(localStorage.getItem('rbeh-qr-detector-history-vault') || '[]');
    
    if(historyStackList.length === 0) {
      historyQrScroller.innerHTML = `<div style="font-size: 12px; opacity: 0.5; padding: 20px 0; text-align: center;">No history logs traced during current sandbox initialization cycle.</div>`;
      return;
    }

    historyQrScroller.innerHTML = '';
    historyStackList.forEach((log) => {
      const rowItemNode = document.createElement('div');
      rowItemNode.className = 'meta-node-data';
      rowItemNode.style.display = 'flex';
      rowItemNode.style.justifyContent = 'space-between';
      rowItemNode.style.alignItems = 'center';
      
      let badgeColorMarker = '#1fa75a';
      if(log.verdict === 'SUSPICIOUS' || log.verdict === 'LOW RISK') badgeColorMarker = '#ff6d00';
      if(log.verdict === 'DANGEROUS') badgeColorMarker = '#e8312f';

      rowItemNode.innerHTML = `
        <div>
          <strong style="font-size:12.5px;">${log.type}</strong>
          <div style="font-size:10.5px; opacity:0.5; margin-top:2px;">${log.time}</div>
        </div>
        <span style="font-size:10.5px; font-weight:800; color:${badgeColorMarker}; text-transform:uppercase; padding:2px 6px; background:rgba(0,0,0,0.03); border-radius:4px;">${log.verdict}</span>
      `;
      historyQrScroller.appendChild(rowItemNode);
    });
  }

  // Secondary Dashboard Action Button Event Mapping Triggers Channels
  if(btnActionReset) {
    btnActionReset.addEventListener('click', () => {
      pasteInputData.value = '';
      qrFileInput.value = '';
      qrPreviewImg.src = '';
      qrPreviewWrapper.style.display = 'none';
      dashboardResultPanel.style.display = 'none';
      errorPresentation.style.display = 'none';
      shutdownCameraHardwarePipelineThreads();
    });
  }

  if(btnCopyAll) {
    btnCopyAll.addEventListener('click', async () => {
      if(!localizedCalculatedResultStringBlob) return;
      try {
        await navigator.clipboard.writeText(localizedCalculatedResultStringBlob);
        const origText = btnCopyAll.innerText;
        btnCopyAll.innerText = "✅ Report Copied!";
        setTimeout(() => { btnCopyAll.innerText = origText; }, 1200);
      } catch(e){}
    });
  }

  if(btnCopyUrl) {
    btnCopyUrl.addEventListener('click', async () => {
      const urlValueStr = dashDestinationUrl.innerText;
      if(!urlValueStr || urlValueStr.startsWith('No links')) return;
      try {
        await navigator.clipboard.writeText(urlValueStr);
        const origTxt = btnCopyUrl.innerText;
        btnCopyUrl.innerText = "✅ URL Copied!";
        setTimeout(() => { btnCopyUrl.innerText = origTxt; }, 1200);
      } catch(e){}
    });
  }

  if(btnFlushQrHist) {
    btnFlushQrHist.addEventListener('click', () => {
      localStorage.removeItem('rbeh-qr-detector-history-vault');
      renderHistoryLogRegistryUI();
    });
  }
});