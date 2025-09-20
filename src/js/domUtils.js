// DOM Utilities for Tool Loading
// Provides safe element access and DOM readiness utilities

/**
 * Wait for DOM to be ready before executing setup functions
 * @returns {Promise} Promise that resolves when DOM is ready
 */
export async function waitForDOM() {
  return new Promise(resolve => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', resolve);
    } else {
      // Use setTimeout to ensure elements are accessible after innerHTML
      setTimeout(resolve, 0);
    }
  });
}

/**
 * Safe element selector with optional warning logging
 * @param {string} id - Element ID to select
 * @param {string} toolName - Tool name for error context (optional)
 * @param {boolean} warn - Whether to log warnings for missing elements (default: true)
 * @returns {HTMLElement|null} Element or null if not found
 */
export function safeSelect(id, toolName = 'Tool', warn = true) {
  const element = document.getElementById(id);
  if (!element && warn) {
    console.warn(`${toolName}: Element with ID '${id}' not found`);
  }
  return element;
}

/**
 * Safe element selector factory for a specific tool
 * @param {string} toolName - Name of the tool for error context
 * @returns {Function} Configured selector function for the tool
 */
export function createSafeSelector(toolName) {
  return (id, warn = true) => safeSelect(id, toolName, warn);
}

/**
 * Validate that critical elements exist before proceeding with setup
 * @param {Array<string>} elementIds - Array of critical element IDs
 * @param {string} toolName - Tool name for error context
 * @returns {boolean} True if all elements exist, false otherwise
 */
export function validateCriticalElements(elementIds, toolName) {
  const missingElements = elementIds.filter(id => !document.getElementById(id));
  
  if (missingElements.length > 0) {
    console.error(`${toolName}: Critical elements not found:`, missingElements);
    return false;
  }
  
  return true;
}

/**
 * Complete setup helper that combines DOM waiting and safe element access
 * @param {Function} setupFunction - Setup function to call after DOM is ready
 * @param {Array<string>} criticalElements - Critical element IDs to validate (optional)
 * @param {string} toolName - Tool name for error context
 * @returns {Promise} Promise that resolves after setup completion
 */
export async function safeSetup(setupFunction, criticalElements = [], toolName = 'Tool') {
  try {
    // Wait for DOM to be ready
    await waitForDOM();
    
    // Validate critical elements if specified
    if (criticalElements.length > 0) {
      if (!validateCriticalElements(criticalElements, toolName)) {
        console.error(`${toolName}: Setup aborted due to missing critical elements`);
        return;
      }
    }
    
    // Execute setup function
    if (typeof setupFunction === 'function') {
      await setupFunction();
    }
  } catch (error) {
    console.error(`${toolName}: Setup failed:`, error);
  }
}