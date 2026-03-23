// Build the Unikorn Injection Function
function injectUnikornLinks() {
  // Target a more resilient base class incase Angular dynamically orders the syntax
  const phoneElements = document.querySelectorAll('p.mat-subtitle-2');
  
  phoneElements.forEach(el => {
    // Skip if we already injected the tracker to prevent infinite loops
    if (el.dataset.unikornProcessed) return;

    const rawText = el.textContent.trim();
    
    // Validate if the payload actually resembles a phone number with a plus prefix
    if (rawText.includes('+')) {
      el.dataset.unikornProcessed = "true";
      
      // Step 1: Strip the + sign exactly as requested
      let searchQuery = rawText.replace(/\+/g, '').replace(/\s/g, '').trim();
      
      // Create the clickable Unikorn injection node as a highly visible Button
      const link = document.createElement('a');
      link.href = `https://unikorn.cloud/patients?q=${searchQuery}`;
      
      // Target a named tab so it physically recycles the same tab instead of infinitely spawning duplicates
      link.target = 'unikorn_search_tab';
      link.title = `Search ${searchQuery} in CRM`;
      
      const iconUrl = chrome.runtime.getURL('icon.png');
      link.innerHTML = `
        <img src="${iconUrl}" style="width: 14px; height: 14px; object-fit: contain;">
        <span>UNIKORN</span>
      `;
      
      link.style.color = '#363534';
      link.style.backgroundColor = '#ffffff';
      link.style.padding = '5px 12px';
      link.style.borderRadius = '20px';
      link.style.marginLeft = '12px';
      link.style.fontWeight = '500';
      link.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      link.style.textDecoration = 'none';
      link.style.fontSize = '10px';
      link.style.cursor = 'pointer';
      link.style.display = 'inline-flex';
      link.style.alignItems = 'center';
      link.style.gap = '6px';
      link.style.border = '1px solid #1e3a8a';
      link.style.boxShadow = '0 3px 6px rgba(29, 78, 216, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1)';
      link.style.transition = 'all 0.2s ease-in-out';
      link.style.zIndex = '999999';
      
      // Inject hover micro-animations natively onto the element
      link.onmouseover = function() {
        this.style.backgroundColor = '#ffffff';
        this.style.transform = 'translateY(-1px)';
        this.style.boxShadow = '0 4px 8px rgba(29, 78, 216, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1)';
      };
      link.onmouseout = function() {
        this.style.backgroundColor = '#ffffff';
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 3px 6px rgba(29, 78, 216, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1)';
      };
      
      // Inject the element into the DOM OUTSIDE the <p> tag!
      // The original <p> tag has overflow: hidden (overflow-dotted) which makes child nodes invisible.
      // By using insertBefore nextSibling, we place it safely outside the hidden CSS boundary.
      if (el.parentNode) {
        el.parentNode.insertBefore(link, el.nextSibling);
        // Force the parent container to align the paragraph and our new button horizontally
        el.parentNode.style.display = 'flex';
        el.parentNode.style.alignItems = 'center';
      }
    }
  });
}

// 1. Run initially on Document Load
injectUnikornLinks();

// 2. Since the external app is Angular (SPA), we deploy a powerful setInterval engine
// to automatically sweep the DOM every 1.5 seconds, guaranteeing dynamic components are caught!
setInterval(injectUnikornLinks, 1500);
