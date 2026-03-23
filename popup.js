// Execute bindings on DOM Load
document.addEventListener('DOMContentLoaded', async () => {
  const masterToggle = document.getElementById('master-toggle');
  const siteToggle = document.getElementById('site-toggle');
  const domainLabel = document.getElementById('domain-label');
  
  // Isolate the exact active external tab Domain using the Chrome manifest APIs
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let url = new URL(tab.url);
  let domain = url.hostname;
  
  domainLabel.innerText = domain;

  // Hook into Chrome's unified Sync Storage pipeline
  // BY DEFAULT, IT IS DISABLED GLOBALLY unless the explicit domain Whitelist array contains this target!
  chrome.storage.sync.get(['masterEnabled', 'enabledDomains'], (data) => {
    let masterEnabled = data.masterEnabled !== false; // Base Master killswitch Defaults ON
    let enabledDomains = data.enabledDomains || []; // Site whitelist defaults OFF
    
    // Inject loaded variables into HTML inputs formally mapping to Whitelist checks
    masterToggle.checked = masterEnabled;
    siteToggle.checked = enabledDomains.includes(domain);

    // Event listener configurations
    masterToggle.addEventListener('change', () => {
      chrome.storage.sync.set({ masterEnabled: masterToggle.checked });
    });

    siteToggle.addEventListener('change', () => {
      if (siteToggle.checked) {
        // Formally append the secure Domain into the explicitly enabled Whitelist
        if (!enabledDomains.includes(domain)) enabledDomains.push(domain);
      } else {
        // Scrub the Domain securely off the Whitelist
        enabledDomains = enabledDomains.filter(d => d !== domain);
      }
      chrome.storage.sync.set({ enabledDomains: enabledDomains });
    });
  });
});
