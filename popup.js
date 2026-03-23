// Execute bindings on DOM Load
document.addEventListener('DOMContentLoaded', async () => {
  const masterToggle = document.getElementById('master-toggle');
  const siteToggle = document.getElementById('site-toggle');
  const domainLabel = document.getElementById('domain-label');
  
  // Isolate the exact active external tab Domain using the Chrome manifest APIs
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let url = new URL(tab.url);
  let domain = url.hostname;
  
  domainLabel.innerText = `Enable on ${domain}`;

  // Hook into Chrome's unified Sync Storage pipeline to fetch user variables
  chrome.storage.sync.get(['masterEnabled', 'disabledDomains'], (data) => {
    // If undefined, default behavior is fully enabled globally
    let masterEnabled = data.masterEnabled !== false; 
    let disabledDomains = data.disabledDomains || [];
    
    // Inject loaded variables into HTML inputs
    masterToggle.checked = masterEnabled;
    siteToggle.checked = !disabledDomains.includes(domain);

    // Event listener configurations
    masterToggle.addEventListener('change', () => {
      chrome.storage.sync.set({ masterEnabled: masterToggle.checked });
    });

    siteToggle.addEventListener('change', () => {
      if (siteToggle.checked) {
        // Remove the current domain from the blacklist mathematically
        disabledDomains = disabledDomains.filter(d => d !== domain);
      } else {
        // Inject the target domain to the strict blacklist securely
        if (!disabledDomains.includes(domain)) disabledDomains.push(domain);
      }
      chrome.storage.sync.set({ disabledDomains: disabledDomains });
    });
  });
});
