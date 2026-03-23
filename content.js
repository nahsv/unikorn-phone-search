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

function injectUnikornLinks() {
  if (!isExtensionEnabled) return;
  
  const walker = document.createTreeWalker(
    document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function(node) {
        if (node.parentElement && node.parentElement.closest('script, style, noscript, button, [data-unikorn-processed="true"]')) {
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
      wrapper.textContent = phoneNode.nodeValue;
      phoneNode.parentNode.replaceChild(wrapper, phoneNode);
      
      // CRITICAL UPGRADE: Build the clickable node natively as a `<span onclick="">` 
      // instead of an Anchor <a href=""> tag! HTML strictly forbids nesting links inside links.
      // If we attempt to inject an anchor next to a phone number already inside a `<a href="tel:">`, the 
      // browser aggressively destroys the hierarchy, displacing icons visually and breaking click receivers!
      const link = document.createElement('span');
      link.title = `Search ${searchQuery} in CRM`;
      link.dataset.unikornProcessed = 'true';
      link.dataset.unikornIcon = 'true'; // For global DOM wiping when extension manually disabled
      
      // Dynamically attach javascript click-receivers natively
      link.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation(); // Mathematically block parent `tel:` anchors from activating their dials
        window.open(`https://unikorn.cloud/patients?q=${searchQuery}`, 'unikorn_search_tab');
      };
      
      const iconUrl = chrome.runtime.getURL('icon.png');
      link.innerHTML = `<img src="${iconUrl}" style="width: 16px; height: 16px; object-fit: contain; display: block;">`;
      
      link.style.backgroundColor = '#ffffff';
      link.style.padding = '4px';
      link.style.borderRadius = '50%';
      link.style.marginRight = '8px'; // Pad out the exact phone string gap
      link.style.cursor = 'pointer';
      link.style.display = 'inline-flex';
      link.style.alignItems = 'center';
      link.style.justifyContent = 'center';
      link.style.border = '1px solid #e2e8f0';
      link.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
      link.style.transition = 'all 0.2s ease-in-out';
      link.style.zIndex = '999999';
      link.style.position = 'relative'; 
      link.style.pointerEvents = 'auto'; 
      link.style.verticalAlign = 'middle';
      
      link.onmouseover = function() {
        this.style.backgroundColor = '#f8fafc';
        this.style.transform = 'translateY(-1px) scale(1.05)';
        this.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        this.style.borderColor = '#cbd5e1';
      };
      link.onmouseout = function() {
        this.style.backgroundColor = '#ffffff';
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
        this.style.borderColor = '#e2e8f0';
      };
      
      // Unikorn HTML5 Hack: We can seamlessly safely inject spans completely into forbidden anchors 
      // without needing complex breakout `closest('a')` geometry that physically separates logos destructively.
      wrapper.parentNode.insertBefore(link, wrapper);
    }
  });
}

// 2. Since the external app is Angular (SPA), we deploy a powerful setInterval engine
// to automatically sweep the DOM every 1.5 seconds, guaranteeing dynamic components are caught!
setInterval(() => {
  if (isExtensionEnabled) injectUnikornLinks();
}, 1500);
