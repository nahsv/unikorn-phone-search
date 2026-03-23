// Build the Global Unikorn Injection Function
function injectUnikornLinks() {
  
  // Create an aggressive TreeWalker to natively scan every text node on the document
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        // Securely skip nodes that are already processed or injected inside structural tags!
        // We use `.closest` to natively climb the DOM tree so text inside nested <span> inside <a> tags are completely skipped.
        if (node.parentElement && node.parentElement.closest('a, script, style, noscript, button, [data-unikorn-processed="true"]')) {
          return NodeFilter.FILTER_REJECT;
        }
        
        // Advanced Global Regex: Matches '+' followed by 8-15 digits natively supporting spacing & hyphens!
        // Guarantee: Prevents false positives against order IDs etc by strictly requiring the E.164 '+' prefix
        if (/\+(?:\d[\-\s]*){7,14}\d/.test(node.nodeValue)) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_SKIP;
      }
    }
  );

  const nodesToProcess = [];
  let currentNode;
  while (currentNode = walker.nextNode()) {
    nodesToProcess.push(currentNode);
  }

  nodesToProcess.forEach(textNode => {
    // Safety check incase the DOM destroyed the node before we reached it
    if (!textNode.parentNode || textNode.parentNode.dataset.unikornProcessed) return;

    // Secure Regex execution exactly isolating the valid phone string chunk anywhere on the webpage
    const phoneRegex = /(\+(?:\d[\-\s]*){7,14}\d)/;
    const match = textNode.nodeValue.match(phoneRegex);
    
    if (match) {
      const phoneNumber = match[1];
      
      // Step 1: Strip formatting cleanly for the backend CRM Search Parameter
      let searchQuery = phoneNumber.replace(/\+/g, '').replace(/\s/g, '').replace(/\-/g, '').trim();
      
      // We safely bisect the Raw Text Node exactly where the phone string lives
      const matchIndex = textNode.nodeValue.indexOf(phoneNumber);
      const phoneNode = textNode.splitText(matchIndex);
      const afterNode = phoneNode.splitText(phoneNumber.length);
      
      // Wrap the raw phone string safely to mark it as processed and protect it
      const wrapper = document.createElement('span');
      wrapper.dataset.unikornProcessed = 'true';
      wrapper.textContent = phoneNode.nodeValue;
      
      // Inject the tracked wrapper natively replacing the raw text node
      phoneNode.parentNode.replaceChild(wrapper, phoneNode);
      
      // Create the clickable Unikorn injection node
      const link = document.createElement('a');
      link.href = `https://unikorn.cloud/patients?q=${searchQuery}`;
      
      // Target a named tab so it physically recycles the same tab instead of infinitely spawning duplicates
      link.target = 'unikorn_search_tab';
      link.title = `Search ${searchQuery} in CRM`;
      link.dataset.unikornProcessed = 'true'; 
      
      const iconUrl = chrome.runtime.getURL('icon.png');
      
      // The button now strictly contains ONLY the Unikorn logo with no text
      link.innerHTML = `<img src="${iconUrl}" style="width: 16px; height: 16px; object-fit: contain; display: block;">`;
      
      // Minimalist Circular Icon Styling
      link.style.backgroundColor = '#ffffff';
      link.style.padding = '4px';
      link.style.borderRadius = '50%'; // Perfect circle
      link.style.marginLeft = '6px';
      link.style.cursor = 'pointer';
      link.style.display = 'inline-flex';
      link.style.alignItems = 'center';
      link.style.justifyContent = 'center';
      link.style.border = '1px solid #e2e8f0';
      link.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
      link.style.transition = 'all 0.2s ease-in-out';
      link.style.zIndex = '999999';
      link.style.verticalAlign = 'middle';
      
      // Inject hover micro-animations natively onto the element
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
      
      // THE MAGIC: Inject the interactive link EXACTLY OUTSIDE the restrictive DOM elements!
      // Angular elements routinely feature `overflow: hidden` bounding boxes. By pushing our button outside
      // the base paragraph natively, we guarantee it remains 100% permanently visible and never clips off the page!
      let trapContainer = wrapper.closest('p, .mat-subtitle-2, .overflow-dotted');
      
      if (trapContainer && trapContainer.parentNode && !['TD', 'TR', 'TABLE', 'BODY'].includes(trapContainer.tagName)) {
        trapContainer.parentNode.insertBefore(link, trapContainer.nextSibling);
        
        // Securely force the parent container to align the original text and our new button horizontally
        trapContainer.parentNode.style.display = 'flex';
        trapContainer.parentNode.style.alignItems = 'center';
      } else {
        // Fallback: If no restrictive container is identified, safely attach it directly to the textual node wrapper.
        wrapper.parentNode.insertBefore(link, wrapper.nextSibling);
      }
    }
  });
}

// 1. Run initially on Document Load
injectUnikornLinks();

// 2. Since the external app is Angular (SPA), we deploy a powerful setInterval engine
// to automatically sweep the DOM every 1.5 seconds, guaranteeing dynamic components are caught!
setInterval(injectUnikornLinks, 1500);
