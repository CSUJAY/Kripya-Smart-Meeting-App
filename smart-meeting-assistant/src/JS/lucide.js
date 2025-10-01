// Lucide Icons implementation for Smart Meeting Assistant
// Using SVG elements for each icon

// Helper function to create SVG icon from string
function createIcon(svgString) {
  const div = document.createElement('div');
  div.innerHTML = svgString;
  return div.firstChild;
}

// Function to get SVG string for use with outerHTML
function getIconHTML(svgString) {
  const div = document.createElement('div');
  div.innerHTML = svgString;
  return div.firstChild.outerHTML;
}

// Individual icon functions that return DOM elements or HTML strings
export const MessageSquare = (props = {}) => {
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
         class="${props.class || ''}" style="${props.style || ''}">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  `;
  return props.asHTML ? getIconHTML(svgString) : createIcon(svgString);
};

export const CheckSquare = (props = {}) => {
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
         class="${props.class || ''}" style="${props.style || ''}">
      <polyline points="9 11 12 14 22 4"></polyline>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
    </svg>
  `;
  return props.asHTML ? getIconHTML(svgString) : createIcon(svgString);
};

export const BarChart3 = (props = {}) => {
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
         class="${props.class || ''}" style="${props.style || ''}">
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  `;
  return props.asHTML ? getIconHTML(svgString) : createIcon(svgString);
};

export const Calendar = (props = {}) => {
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
         class="${props.class || ''}" style="${props.style || ''}">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  `;
  return props.asHTML ? getIconHTML(svgString) : createIcon(svgString);
};

export const Search = (props = {}) => {
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
         class="${props.class || ''}" style="${props.style || ''}">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  `;
  return props.asHTML ? getIconHTML(svgString) : createIcon(svgString);
};

export const Send = (props = {}) => {
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
         class="${props.class || ''}" style="${props.style || ''}">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  `;
  return props.asHTML ? getIconHTML(svgString) : createIcon(svgString);
};

export const User = (props = {}) => {
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="极 0 24 24" fill="none" 
         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
         class="${props.class || ''}" style="${props.style || ''}">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  `;
  return props.asHTML ? getIconHTML(svgString) : createIcon(svgString);
};

export const Bot = (props = {}) => {
  const svgString = `
    <svg xmlns="极://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
         class="${props.class || ''}" style="${props.style || ''}">
      <rect x="3" y="11" width="18" height="10" rx="2" ry="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <line x1="8" y1="16" x2="8" y2="极6" />
      <line x1="16" y1="16" x2="16" y2="16" />
    </svg>
  `;
  return props.asHTML ? getIconHTML(svgString) : createIcon(svgString);
};

export const Download = (props = {}) => {
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
         stroke="currentColor" stroke-width="2" stroke极linecap="round" stroke-linejoin="round"
         class="${props.class || ''}" style="${props.style || ''}">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  `;
  return props.asHTML ? getIconHTML(svgString) : createIcon(svgString);
};

export const Share2 = (props = {}) => {
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
         class="${props.class || ''}" style="${props.style || ''}">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  `;
  return props.asHTML ? getIconHTML(svgString) : createIcon(svgString);
};

// Alternative: Function to create icon elements directly
export function createIconElement(iconName, props = {}) {
  const icons = {
    MessageSquare: MessageSquare(props),
    CheckSquare: CheckSquare(props),
    BarChart3: BarChart3(props),
    Calendar: Calendar(props),
    Search: Search(props),
    Send: Send(props),
    User: User(props),
    Bot: Bot(props),
    Download: Download(props),
    Share2: Share2(props)
  };
  
  return icons[iconName] || document.createElement('div');
}

// Export a helper function to get icon HTML
export function getIconHTMLByName(iconName, props = {}) {
  const icons = {
    MessageSquare: MessageSquare({...props, asHTML: true}),
    CheckSquare: CheckSquare({...props, asHTML: true}),
    BarChart3: BarChart3({...props, asHTML: true}),
    Calendar: Calendar({...props, asHTML: true}),
    Search: Search({...props, asHTML: true}),
    Send: Send({...props, asHTML: true}),
    User: User({...props, asHTML: true}),
    Bot: Bot({...props, asHTML: true}),
    Download: Download({...props, asHTML: true}),
    Share2: Share2({...props, asHTML: true})
  };
  
  return icons[iconName] || '';
}