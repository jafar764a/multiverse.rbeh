// js/tools.js - Logic layer connecting tool interactions to designated endpoints
document.addEventListener('DOMContentLoaded', () => {
  const toolCards = document.querySelectorAll('.tool-action-card');

  // Hardcoded secure file mapping matrix
  const navigationMap = {
    'api/phishing.js': 'phishing-detector.html',
    'api/password.js': 'password-checker.html',
    'api/encryption.js': 'text-encryption.html',
    'api/file-encryption.js': 'file-encryption.html',
    'api/qr.js': 'qr-detector.html',
    'api/password-generator.js': 'password-generator.html'
  };

  toolCards.forEach(card => {
    // Make entire card interactive and clickable
    card.addEventListener('click', (event) => {
      const apiEndpoint = card.getAttribute('data-api');
      
      if (apiEndpoint && navigationMap[apiEndpoint]) {
        console.log(`[RBEH Multiverse] Navigating seamlessly to: ${navigationMap[apiEndpoint]}`);
        
        // Immediate redirection without any popups, alerts, or intermediate prompts
        window.location.href = navigationMap[apiEndpoint];
      }
    });
  });
});