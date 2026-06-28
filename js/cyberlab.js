/**
 * RBEH Multiverse – Cyber Lab Interaction & Navigation Core
 * Controls background terminal feeds, layout animations, and structural navigation pipelines.
 */
document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. DIRECT SECURE NAVIGATION MATRIX LOGIC
    // ==========================================
    const demoCards = document.querySelectorAll(".tool-action-card");

    demoCards.forEach((card) => {
        // Accessibility: Make card keyboard focusable
        card.setAttribute("tabindex", "0");
        card.style.cursor = "pointer";

        // Unified Handler function for execution redirect
        const handleNavigation = (event) => {
            // Read target directly from data attribute
            const targetRedirect = card.getAttribute("data-redirect") || card.dataset.redirect;
            
            if (targetRedirect) {
                // Instantly update viewport destination in the same tab
                window.location.href = targetRedirect;
            }
        };

        // Trigger on Mouse Click / Mobile Touch Tap
        card.addEventListener("click", handleNavigation);

        // Trigger on Keyboard Accessible Actions (Enter Key)
        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                handleNavigation(event);
            }
        });
    });

    // ==========================================
    // 2. CORE LAB HOVER & GLASS GLOW EFFECT ENGINE
    // ==========================================
    demoCards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Set coordinates dynamically for style rules bindings
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });
    });

    // ==========================================
    // 3. PERSISTENT TERMINAL STREAM SIMULATOR
    // ==========================================
    const terminalBody = document.getElementById("terminal-body");
    if (terminalBody) {
        const structuralLogs = [
            "Initializing isolated sandboxed virtual node network...",
            "Loading local crypto analysis signature structures...",
            "Firewall status rules: DEFAULT_DROP inbound configured.",
            "Ready for diagnostic execution modules tracking..."
        ];

        let logIndex = 0;
        const printNextLogLine = () => {
            if (logIndex < structuralLogs.length) {
                const logParagraph = document.createElement("p");
                logParagraph.className = "output";
                logParagraph.style.opacity = "0";
                logParagraph.style.transition = "opacity 0.4s ease-in";
                logParagraph.innerHTML = `&gt; ${structuralLogs[logIndex]}`;
                
                // Insert before the terminal input prompt indicator line
                const promptLine = terminalBody.querySelector(".prompt-line");
                if (promptLine) {
                    terminalBody.insertBefore(logParagraph, promptLine);
                } else {
                    terminalBody.appendChild(logParagraph);
                }

                // Smooth fade effect trigger
                setTimeout(() => { logParagraph.style.opacity = "0.75"; }, 50);
                
                // Auto scroll terminal to show latest lines
                terminalBody.scrollTop = terminalBody.scrollHeight;
                logIndex++;
                setTimeout(printNextLogLine, 1800);
            }
        };

        // Start delayed logging sequence simulation loop
        setTimeout(printNextLogLine, 2200);
    }
});