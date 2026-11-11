/**
 * Vercel Speed Insights initialization
 * Automatically tracks web vitals and performance metrics
 * 
 * This script initializes the Speed Insights queue and loads the tracking script.
 * On Vercel deployments, the script will automatically collect performance data.
 */

(function() {
  // Initialize the Speed Insights queue
  window.si = window.si || function () { 
    (window.siq = window.siq || []).push(arguments); 
  };
  
  // Load the Speed Insights script
  const script = document.createElement('script');
  script.defer = true;
  script.src = '/_vercel/speed-insights/script.js';
  
  script.onerror = function() {
    console.log('[Vercel Speed Insights] Script not loaded. This is expected in local development. Speed Insights will work when deployed to Vercel.');
  };
  
  document.head.appendChild(script);
})();
