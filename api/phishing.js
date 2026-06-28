/**
 * RBEH Multiverse - Phishing Link Detector Engine (Hybrid Architecture)
 * Production Integration: Synchronous Heuristic Analyzer + Authentic VirusTotal v3 REST API Engine.
 */

// Secure Production API Token Allocation
const VT_API_KEY = "8a8e79fc2485c9d165a65f3c2f500424929a8f04704ef8d7ea8912280d9fdad1";

window.executePhishingAnalysis = async function(targetUrl) {
    console.log(`[RBEH Hybrid Engine] Active scanning sequence initiated for: ${targetUrl}`);
    
    const loaderStatus = document.getElementById('loader-status-msg');
    
    // 1. URL Normalization and Verification Layer
    let normalizedUrl = targetUrl.trim();
    if (!/^https?:\/\//i.test(normalizedUrl)) {
        normalizedUrl = 'http://' + normalizedUrl; 
    }

    let urlObj;
    try {
        urlObj = new URL(normalizedUrl);
    } catch (e) {
        showScannerError("Invalid URL Format pattern detected. Please enter a valid website address.");
        return;
    }

    // STEP 1: Immediate Manual Heuristic Analysis Execution
    if (loaderStatus) loaderStatus.innerText = "Executing Manual JavaScript Heuristic Rule Checks...";
    const heuristicResult = performManualHeuristicAnalysis(normalizedUrl, urlObj);

    // STEP 2: Automatic Real-Time VirusTotal v3 API Query Pipeline
    if (loaderStatus) loaderStatus.innerText = "Connecting to VirusTotal v3 Core Infrastructure Modules...";
    let vtResult = null;
    let vtErrorOccurred = false;
    let vtErrorMessage = "";

    try {
        vtResult = await fetchVirusTotalV3Data(normalizedUrl);
    } catch (error) {
        console.error("[VirusTotal Subsystem Error]", error);
        vtErrorOccurred = true;
        vtErrorMessage = error.message || "VirusTotal service unavailable.";
    }

    // STEP 3: Combine Analyses into a Single Unified Production Vector Report
    if (loaderStatus) loaderStatus.innerText = "Formatting Diagnostic Security Telemetry Frame...";
    const consolidatedReport = mergeAnalysisVectors(heuristicResult, vtResult, normalizedUrl, urlObj, vtErrorOccurred, vtErrorMessage);

    // STEP 4: Render High-Fidelity UI Dashboard Layout
    renderSecurityDashboard(consolidatedReport);
};

/**
 * Genuine JavaScript Manual Heuristics Calculation Engine
 */
function performManualHeuristicAnalysis(url, urlObj) {
    let score = 0;
    const checks = {
        isHttps: urlObj.protocol === 'https:',
        isHttp: urlObj.protocol === 'http:',
        urlLength: url.length,
        isValidFormat: true,
        isIpDomain: /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(urlObj.hostname),
        isShortener: /^(bit\.ly|goo\.gl|t\.co|tinyurl\.com|is\.gd|buff\.ly|adf\.ly|bit\.do)$/i.test(urlObj.hostname),
        suspiciousKeywords: [],
        subdomainCount: urlObj.hostname.split('.').filter(Boolean).length - 2,
        hasPunycode: urlObj.hostname.includes('xn--'),
        hasSpecialChars: /[~@!$%^*()_=+\[\]{}|;:',<>?]/.test(url.replace(urlObj.protocol, '')),
        hasRedirectPattern: urlObj.search.includes('http://') || urlObj.search.includes('https://') || urlObj.pathname.includes('http')
    };

    // Rigorous Rule Scoring Algorithms
    if (checks.isHttp) score += 25;
    if (checks.urlLength > 75) score += 15;
    if (checks.isIpDomain) score += 35;
    if (checks.isShortener) score += 15;
    if (checks.subdomainCount > 3) score += 20;
    if (checks.hasPunycode) stroke += 30;
    if (checks.hasSpecialChars) score += 10;
    if (checks.hasRedirectPattern) score += 20;

    // Target Threat Vector Keyword Mapping System
    const dangerousKeywords = ['login', 'verify', 'secure', 'banking', 'account', 'wallet', 'update', 'free', 'bonus', 'gift', 'prize', 'crypto', 'signin', 'live'];
    dangerousKeywords.forEach(keyword => {
        if (url.toLowerCase().includes(keyword)) {
            checks.suspiciousKeywords.push(keyword);
            score += 12;
        }
    });

    score = Math.min(Math.max(score, 0), 100);
    return { score, checks };
}

/**
 * Authentic Asynchronous VirusTotal v3 Endpoint Connector via Base64 Identification
 */
async function fetchVirusTotalV3Data(url) {
    if (!navigator.onLine) {
        throw new Error("No Internet Connection detected. Check your local interface.");
    }

    // Step A: Standard URL Base64 Variant Encoding (URL-Safe variant without padding)
    const base64UrlId = btoa(url).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

    // Step B: Direct Resource GET Request Pipeline
    const response = await fetch(`https://www.virustotal.com/api/v3/urls/${base64UrlId}`, {
        method: 'GET',
        headers: { 'x-apikey': VT_API_KEY }
    });

    if (response.status === 429) {
        throw new Error("VirusTotal daily or per-minute request limit reached. Showing Manual Analysis only.");
    }

    if (!response.ok) {
        // Fallback: If URL hash does not exist inside VT registry, request an interactive analytical scan posting
        const postResponse = await fetch('https://www.virustotal.com/api/v3/urls', {
            method: 'POST',
            headers: { 
                'x-apikey': VT_API_KEY, 
                'Content-Type': 'application/x-www-form-urlencoded' 
            },
            body: `url=${encodeURIComponent(url)}`
        });

        if (!postResponse.ok) {
            throw new Error(`VirusTotal API Error. HTTP Status: ${response.status}`);
        }

        return { pending: true };
    }

    const json = await response.json();
    const attributes = json?.data?.attributes;
    
    if (!attributes) {
        throw new Error("VirusTotal response format variation caught.");
    }

    return {
        pending: false,
        reputation: attributes.reputation || 0,
        communityScore: attributes.total_votes ? (attributes.total_votes.harmless - attributes.total_votes.malicious) : 0,
        malicious: attributes.last_analysis_stats?.malicious || 0,
        suspicious: attributes.last_analysis_stats?.suspicious || 0,
        harmless: attributes.last_analysis_stats?.harmless || 0,
        undetected: attributes.last_analysis_stats?.undetected || 0,
        lastAnalysisDate: attributes.last_analysis_date ? new Date(attributes.last_analysis_date * 1000).toLocaleString() : 'N/A',
        threatCategory: attributes.categories ? Object.values(attributes.categories)[0] : null
    };
}

/**
 * Consolidated Vector Processing Logic Engine
 */
function mergeAnalysisVectors(heuristic, vt, rawUrl, urlObj, vtError, vtErrorMsg) {
    let finalScore = heuristic.score;
    let vtStatusString = "Analysis Completed Successfully";
    
    if (vtError) {
        vtStatusString = `VirusTotal Scan Unavailable (${vtErrorMsg})`;
    } else if (vt && vt.pending) {
        vtStatusString = "URL Registered in Scan Queue Stream. Re-analyze shortly for details.";
    } else if (vt) {
        // Real-Time Dynamic Risk Score Tuning derived from authentic detections
        const criticalHits = vt.malicious + vt.suspicious;
        if (criticalHits > 0) {
            finalScore = Math.min(Math.max(finalScore, 50) + (criticalHits * 20), 100);
        } else if (vt.harmless > 0 && finalScore > 40) {
            finalScore = Math.max(finalScore - 20, 0); // Safely scale down heuristics penalties if engine confirms clean mapping
        }
    }

    // Strict Target Verdict Boundary Assignments
    let verdict = "SAFE";
    let recommendation = "This website appears safe based on Manual Heuristic Analysis and authentic VirusTotal security parameters.";

    if (finalScore > 20 && finalScore <= 40) {
        verdict = "LOW RISK";
        recommendation = "This website appears mostly safe but review carefully before entering sensitive information.";
    } else if (finalScore > 40 && finalScore <= 60) {
        verdict = "SUSPICIOUS";
        recommendation = "Proceed carefully. Verify the website details and structural indicators before continuing.";
    } else if (finalScore > 60) {
        verdict = "DANGEROUS";
        recommendation = "Do not open this website. Never enter passwords, OTPs, banking details, or personal sensitive information.";
    }

    return {
        url: rawUrl,
        domain: urlObj.hostname,
        finalScore,
        verdict,
        recommendation,
        vtStatus: vtStatusString,
        vtAvailable: (vt !== null && !vt.pending && !vtError),
        vtData: vt,
        heuristicData: heuristic.checks,
        manualScore: heuristic.score,
        scanTime: new Date().toLocaleString()
    };
}

/**
 * High-Fidelity Responsive Glass Dashboard Matrix UI Rendering Layer
 */
function renderSecurityDashboard(report) {
    // Progress UI loaders code management
    const loader = document.getElementById('analysis-loader');
    if (loader) loader.style.display = 'none';

    // Existing old nodes dynamic destruction pipeline
    const staleDashboard = document.getElementById('rbeh-dynamic-dashboard');
    if (staleDashboard) staleDashboard.remove();

    const mountPoint = document.getElementById('dynamic-dashboard-mount-node') || document.querySelector('.hero-left');
    const container = document.createElement('div');
    container.id = 'rbeh-dynamic-dashboard';
    container.className = 'scanner-card-wrapper';
    container.style.marginTop = '24px';

    let colorWeight = '#1fa75a'; // Safe Green
    if (report.verdict === 'LOW RISK') colorWeight = '#e8821e';
    if (report.verdict === 'SUSPICIOUS') colorWeight = '#f97316';
    if (report.verdict === 'DANGEROUS') colorWeight = '#e8312f';

    container.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(232,49,47,0.12); padding-bottom:16px; margin-bottom:24px;">
            <div>
                <span style="font-size:11px; font-weight:700; opacity:0.6; text-transform:uppercase; letter-spacing:1px; display:block; margin-bottom:4px;">Unified Engine Output</span>
                <h3 style="font-weight:800; font-size:20px; letter-spacing:-0.5px; margin:0;">SECURITY TELEMETRY REPORT</h3>
            </div>
            <span style="background:${colorWeight}; color:#fff; padding:8px 16px; border-radius:30px; font-weight:800; font-size:14px; letter-spacing:0.5px; box-shadow: 0 4px 12px ${colorWeight}40;">
                ${report.verdict === 'SAFE' ? '✅ SAFE' : report.verdict === 'LOW RISK' ? '🟡 LOW RISK' : report.verdict === 'SUSPICIOUS' ? '🟠 SUSPICIOUS' : '🔴 DANGEROUS'}
            </span>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:20px; margin-bottom:24px;">
            <div style="padding:20px; background:rgba(0,0,0,0.02); border-radius:12px; border:1px solid rgba(0,0,0,0.04); text-align:center; display:flex; flex-direction:column; justify-content:center; align-items:center;">
                <h5 style="font-size:12px; opacity:0.6; margin-bottom:12px; text-transform:uppercase; font-weight:700;">Threat Severity Index</h5>
                
                <div style="position:relative; width:100%; height:12px; background:rgba(0,0,0,0.06); border-radius:30px; overflow:hidden; margin-bottom:10px;">
                    <div style="position:absolute; top:0; left:0; height:100%; width:${report.finalScore}%; background:${colorWeight}; transition:width 1s cubic-bezier(0.1, 1, 0.1, 1); border-radius:30px;"></div>
                </div>
                <div style="font-size:28px; font-weight:900; color:${colorWeight};">${report.finalScore}<span style="font-size:14px; opacity:0.5; font-weight:500;">/100</span></div>
            </div>
            <div style="padding:20px; background:rgba(0,0,0,0.02); border-radius:12px; border:1px solid rgba(0,0,0,0.04); display:flex; flex-direction:column; justify-content:center;">
                <h5 style="font-size:12px; opacity:0.6; margin-bottom:8px; text-transform:uppercase; font-weight:700;">Strategic Recommendation</h5>
                <p style="font-size:13.5px; line-height:1.5; font-weight:600; margin:0; opacity:0.9;">${report.recommendation}</p>
            </div>
        </div>

        <div style="margin-bottom:24px; padding:18px; background:rgba(232,49,47,0.02); border:1px solid rgba(232,49,47,0.08); border-radius:12px;">
            <h4 style="font-size:13px; font-weight:800; margin-bottom:12px; opacity:0.8; text-transform:uppercase; letter-spacing:0.5px; color:#e8312f;">🌐 Authentic VirusTotal Registry Scan</h4>
            <p style="font-size:12px; font-weight:600; margin-bottom:12px; opacity:0.7;">Status: <span style="color:${colorWeight};">${report.vtStatus}</span></p>
            
            ${report.vtAvailable ? `
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:12px; font-size:13px;">
                    <div><strong>Reputation Index:</strong> ${report.vtData.reputation}</div>
                    <div><strong>Community Score:</strong> ${report.vtData.communityScore}</div>
                    <div style="color:${report.vtData.malicious > 0 ? '#e8312f' : 'inherit'}"><strong>Malicious Matches:</strong> ${report.vtData.malicious}</div>
                    <div style="color:${report.vtData.suspicious > 0 ? '#f97316' : 'inherit'}"><strong>Suspicious Flags:</strong> ${report.vtData.suspicious}</div>
                    <div><strong>Harmless Markers:</strong> ${report.vtData.harmless}</div>
                    <div><strong>Undetected Metrics:</strong> ${report.vtData.undetected}</div>
                    <div style="grid-column:span 2; font-size:12px; opacity:0.7; margin-top:4px;"><strong>Threat Category:</strong> ${report.vtData.threatCategory || 'None Classified'}</div>
                    <div style="grid-column:span 2; font-size:11px; opacity:0.5;"><strong>Last Sync Timestamp:</strong> ${report.vtData.lastAnalysisDate}</div>
                </div>
            ` : `<p style="font-size:12px; opacity:0.5; margin:0;">Real-time automated scanning details omitted because external data streams are currently restricted or unreachable.</p>`}
        </div>

        <div style="margin-bottom:24px; padding:18px; background:rgba(0,0,0,0.01); border:1px solid rgba(0,0,0,0.04); border-radius:12px;">
            <h4 style="font-size:13px; font-weight:800; margin-bottom:12px; opacity:0.8; text-transform:uppercase; letter-spacing:0.5px;">🔍 Manual Heuristic Signatures Checklist</h4>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:10px; font-size:12.5px;">
                <div>${report.heuristicData.isHttps ? '✔ HTTPS Protected Layer' : '✖ HTTP Connection Warning'}</div>
                <div>URL Code Length: ${report.heuristicData.urlLength} characters</div>
                <div>${report.heuristicData.isIpDomain ? '🚨 Raw IP Destination Tracked' : '✔ Standard DNS Registration'}</div>
                <div>${report.heuristicData.isShortener ? '🚨 Link Masking Shortener Used' : '✔ Direct Link Structure'}</div>
                <div>Route Subdomains: ${report.heuristicData.subdomainCount} tracked</div>
                <div>${report.heuristicData.hasPunycode ? '🚨 Punycode Spoofing Detected' : '✔ Clean Text Domain Matrix'}</div>
                <div>${report.heuristicData.hasSpecialChars ? '🚨 Excess Special Characters Map' : '✔ Standard String Set'}</div>
                <div>${report.heuristicData.hasRedirectPattern ? '🚨 Suspicious Redirect Injection' : '✔ Direct Routing Link'}</div>
                <div style="grid-column:span 2; opacity:0.85;"><strong>Keywords Flagged:</strong> ${report.heuristicData.suspiciousKeywords.join(', ') || 'None Triggered'}</div>
                <div style="grid-column:span 2; border-top:1px dashed rgba(0,0,0,0.06); padding-top:6px; font-weight:600;">Manual Component Vulnerability Weight: ${report.manualScore}/100</div>
            </div>
        </div>

        <div style="font-size:11px; opacity:0.5; margin-bottom:20px;"><strong>Scan Reference Time:</strong> ${report.scanTime} | Target Address: ${report.url}</div>

        <div style="display:flex; gap:12px; flex-wrap:wrap; padding-top:12px; border-top:1px solid rgba(0,0,0,0.05);" id="rbeh-action-btn-matrix">
            <button class="btn btn-primary" id="btn-scan-another" style="font-size:13px; padding:10px 16px;">🔄 Scan Another URL</button>
            <button class="btn btn-secondary" id="btn-copy-report" style="font-size:13px; padding:10px 16px;">📋 Copy Report</button>
            <button class="btn btn-secondary" id="btn-download-report" style="font-size:13px; padding:10px 16px;">📄 Download Report (.TXT)</button>
            <button class="btn btn-secondary" id="btn-clear-dashboard" style="font-size:13px; padding:10px 16px; color:#e8312f; border-color:rgba(232,49,47,0.2);">🗑 Clear Result</button>
        </div>
    `;

    mountPoint.appendChild(container);

    // Synchronize localized Dark Mode adaptive CSS styling down data trees
    if (document.body.getAttribute('data-theme') === 'dark') {
        container.style.backgroundColor = 'rgba(13, 13, 16, 0.5)';
        container.style.borderColor = 'rgba(255, 77, 77, 0.2)';
    }

    // 5. Interactive Utility Actions Event Framework Bindings
    document.getElementById('btn-scan-another').addEventListener('click', () => {
        const inputField = document.getElementById('target-url');
        if (inputField) {
            inputField.value = '';
            inputField.focus();
        }
        container.remove();
    });

    document.getElementById('btn-clear-dashboard').addEventListener('click', () => {
        container.remove();
    });

    document.getElementById('btn-copy-report').addEventListener('click', () => {
        const structuralDataString = JSON.stringify(report, null, 2);
        navigator.clipboard.writeText(structuralDataString);
        alert("Unified analytical metrics telemetry array copied to system clipboard registers successfully.");
    });

    document.getElementById('btn-download-report').addEventListener('click', () => {
        let textPayload = `RBEH MULTIVERSE METRICS - SECURITY LOG REPORT\r\n============================================\r\nTarget URL Checked: ${report.url}\r\nSecurity Verdict  : ${report.verdict}\r\nComposite Score   : ${report.finalScore}/100\r\nHeuristics Metric : ${report.manualScore}/100\r\nVirusTotal Status : ${report.vtStatus}\r\nRecommendation    : ${report.recommendation}\r\nScan Complete Time: ${report.scanTime}\r\n`;
        
        const blob = new Blob([textPayload], { type: 'text/plain' });
        const temporaryAnchorElement = document.createElement('a');
        temporaryAnchorElement.href = URL.createObjectURL(blob);
        temporaryAnchorElement.download = `RBEH_URL_Report_${Date.now()}.txt`;
        temporaryAnchorElement.click();
    });

    // Automatically record verified metrics sequence into historical logging engines
    if (typeof window.commitToScanHistory === 'function') {
        window.commitToScanHistory(report);
    }
}

/**
 * Isolated Global Error Displayer Function
 */
function showScannerError(message) {
    const loader = document.getElementById('analysis-loader');
    if (loader) loader.style.display = 'none';

    const errorAlert = document.getElementById('error-alert-handle');
    if (errorAlert) {
        errorAlert.style.display = 'block';
        errorAlert.innerText = `⚠️ ${message}`;
    }
}