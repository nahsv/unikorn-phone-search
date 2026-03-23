let isExtensionEnabled = false; // Default FALLBACK Active State is completely disabled

// Safely boot the Chrome Sync Engine globally checking our master GUI toggles
chrome.storage.sync.get(['masterEnabled', 'enabledDomains'], (data) => {
  updateStatus(data);
  if (isExtensionEnabled) {
    injectUnikornLinks();
  }
});

// Create realtime bindings ensuring changes immediately reflect physically in the DOM
chrome.storage.onChanged.addListener(() => {
  chrome.storage.sync.get(['masterEnabled', 'enabledDomains'], (data) => {
    let wasEnabled = isExtensionEnabled;
    updateStatus(data);
    
    if (isExtensionEnabled && !wasEnabled) {
      // System enabled via popup UI, restart routines visually
      injectUnikornLinks();
    } else if (!isExtensionEnabled) {
      // System explicitly disabled via UI: completely wipe Unikorn buttons clean off the active screen
      const activeIcons = document.querySelectorAll('span[data-unikorn-icon="true"]');
      activeIcons.forEach(icon => icon.remove());
      const activeWrappers = document.querySelectorAll('span[data-unikorn-processed="true"]');
      activeWrappers.forEach(wrap => delete wrap.dataset.unikornProcessed);
    }
  });
});

function updateStatus(data) {
  let master = data.masterEnabled !== false;
  let enabledWhitelist = data.enabledDomains || [];
  
  // Extension explicitly disabled globally by default unless added to White List payload
  isExtensionEnabled = master && enabledWhitelist.includes(window.location.hostname);
}

// Extracted the Button Generator globally so it can be deployed efficiently across standard and anchor passes
function createUnikornButton(searchQuery) {
  const link = document.createElement('span');
  link.title = `Search ${searchQuery} in CRM`;
  link.dataset.unikornProcessed = 'true';
  link.dataset.unikornIcon = 'true'; 
  
  // Dynamically attach javascript click-receivers natively
  link.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Mathematically block parent elements from activating their respective clicks
    window.open(`https://unikorn.cloud/patients?q=${searchQuery}`, 'unikorn_search_tab');
  };
  
  const iconUrl = chrome.runtime.getURL('icon.png');
  link.innerHTML = `<img src="${iconUrl}" style="width: 16px; height: 16px; object-fit: contain; display: block;">`;
  
  link.style.marginRight = '8px';
  link.style.cursor = 'pointer';
  link.style.display = 'inline-flex';
  link.style.alignItems = 'center';
  link.style.justifyContent = 'center';
  link.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
  link.style.transition = 'all 0.2s ease-in-out';
  link.style.zIndex = '999999';
  link.style.position = 'relative'; 
  link.style.pointerEvents = 'auto'; 
  link.style.verticalAlign = 'middle';
  
  link.onmouseover = function() {
    this.style.transform = 'translateY(-1px) scale(1.05)';
    this.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
  };
  link.onmouseout = function() {
    this.style.transform = 'translateY(0) scale(1)';
    this.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
  };
  
  return link;
}


function injectUnikornLinks() {
  if (!isExtensionEnabled) return;
  
  // ---------------------------------------------------------------------
  // PASS 1: Global TreeWalker Regex Scanner
  // ---------------------------------------------------------------------
  const walker = document.createTreeWalker(
    document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function(node) {
        // We explicitly REMOVED 'button' from this rejection array! 
        // This formally allows the crawler to discover phone digits inside frontend standard buttons!
        if (node.parentElement && node.parentElement.closest('script, style, noscript, [data-unikorn-processed="true"]')) {
          return NodeFilter.FILTER_REJECT;
        }
        
        // Exact Date-Rejection Expressions parsing 10-15 digit raw blocks strictly avoiding Hyphen formats visually mapped to 2024-dates
        if (/(?:^|[^a-zA-Z0-9])((?:\+\d{1,3}[\-\s]?(?:\d[\-\s]?){6,12}\d)|(?:\b\d{9,12}\b)|(?:\b\d{3,5}[\-\s]\d{3,5}(?:[\-\s]\d{3,5})?\b))(?=[^a-zA-Z0-9]|$)/.test(node.nodeValue)) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_SKIP;
      }
    }
  );

  const nodesToProcess = [];
  let currentNode;
  while (currentNode = walker.nextNode()) nodesToProcess.push(currentNode);

  nodesToProcess.forEach(textNode => {
    if (!textNode.parentNode || textNode.parentNode.dataset.unikornProcessed) return;

    const phoneRegex = /(?:^|[^a-zA-Z0-9])((?:\+\d{1,3}[\-\s]?(?:\d[\-\s]?){6,12}\d)|(?:\b\d{9,12}\b)|(?:\b\d{3,5}[\-\s]\d{3,5}(?:[\-\s]\d{3,5})?\b))(?=[^a-zA-Z0-9]|$)/;
    const match = textNode.nodeValue.match(phoneRegex);
    
    if (match) {
      const phoneNumber = match[1];
      let searchQuery = phoneNumber.replace(/\+/g, '').replace(/\s/g, '').replace(/\-/g, '').trim();
      
      const matchIndex = textNode.nodeValue.indexOf(phoneNumber);
      const phoneNode = textNode.splitText(matchIndex);
      const afterNode = phoneNode.splitText(phoneNumber.length);
      
      const wrapper = document.createElement('span');
      wrapper.dataset.unikornProcessed = 'true';
      wrapper.style.display = 'inline-flex';
      wrapper.style.alignItems = 'center';
      
      phoneNode.parentNode.replaceChild(wrapper, phoneNode);
      
      const link = createUnikornButton(searchQuery);
      
      wrapper.appendChild(link);
      wrapper.appendChild(document.createTextNode(phoneNode.nodeValue));
    }
  });


  // ---------------------------------------------------------------------
  // PASS 2: Explicit Native "tel:" Anchor Extractor
  // ---------------------------------------------------------------------
  // This explicitly hooks components displaying generic text (e.g. "Call Us") which completely dodge the Regex!
  const telLinks = document.querySelectorAll('a[href^="tel:"]:not([data-unikorn-processed="true"])');
  
  telLinks.forEach(aTag => {
    // Failsafe exit to preclude DOM recursion loops
    if (aTag.closest('[data-unikorn-processed="true"]')) return;
    
    let href = aTag.getAttribute('href') || '';
    // Mathematically slice out prefixes (e.g. tel:// or tel:)
    let phoneNumber = href.replace(/^tel:(\/\/)?/i, '').trim();
    if (!phoneNumber) return;
    
    let searchQuery = phoneNumber.replace(/\+/g, '').replace(/\s/g, '').replace(/\-/g, '').trim();
    if (searchQuery.length < 5) return; // Prevent incredibly generic numeric IDs
    
    aTag.dataset.unikornProcessed = 'true';
    
    // Explicit DOM mutation safely trapping the original anchor inside a 1:1 sibling array
    const wrapper = document.createElement('span');
    wrapper.dataset.unikornProcessed = 'true';
    wrapper.style.display = 'inline-flex';
    wrapper.style.alignItems = 'center';
    
    aTag.parentNode.replaceChild(wrapper, aTag);
    
    const link = createUnikornButton(searchQuery);
    
    // Inject natively! First the button, then the actual Anchor link!
    wrapper.appendChild(link);
    wrapper.appendChild(aTag);
  });
  
}

// Since the external app is Angular (SPA), we deploy a powerful setInterval engine
// to automatically sweep the DOM every 1.5 seconds, guaranteeing dynamic components are caught!
setInterval(() => {
  if (isExtensionEnabled) injectUnikornLinks();
}, 1500);
