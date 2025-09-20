// CSS Loading Utility - Centralized CSS management for all tools
// Provides consistent, reliable CSS loading with proper timing and cache management

class CSSLoader {
  constructor() {
    this.loadedCSS = new Set();
    this.loadingPromises = new Map();
  }

  /**
   * Load CSS file with proper timing, caching, and error handling
   * @param {string} cssFile - CSS filename (e.g., 'numberBaseTool.css')
   * @param {string} toolId - Unique tool identifier for tracking
   * @returns {Promise} Promise that resolves when CSS is loaded
   */
  async loadCSS(cssFile, toolId) {
    const cssId = `${toolId}-css-link`;
    const cssPath = `/${cssFile}?v=${Date.now()}`;

    // If already loading, return existing promise
    if (this.loadingPromises.has(cssId)) {
      return this.loadingPromises.get(cssId);
    }

    // If already loaded, return immediately
    if (this.loadedCSS.has(cssId)) {
      return Promise.resolve();
    }

    const promise = new Promise((resolve, reject) => {
      // Remove existing CSS link if present
      const existingLink = document.getElementById(cssId);
      if (existingLink) {
        existingLink.remove();
        this.loadedCSS.delete(cssId);
      }

      // Create new CSS link
      const link = document.createElement('link');
      link.id = cssId;
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = cssPath;

      // Set up load handlers
      link.onload = () => {
        console.log(`✓ CSS loaded successfully: ${cssFile}`);
        this.loadedCSS.add(cssId);
        this.loadingPromises.delete(cssId);
        resolve();
      };

      link.onerror = () => {
        console.error(`✗ Failed to load CSS: ${cssFile}`);
        this.loadingPromises.delete(cssId);
        reject(new Error(`Failed to load CSS: ${cssFile}`));
      };

      // Add timeout for stuck loads
      const timeout = setTimeout(() => {
        console.warn(`⚠ CSS load timeout: ${cssFile}`);
        this.loadingPromises.delete(cssId);
        reject(new Error(`CSS load timeout: ${cssFile}`));
      }, 10000); // 10 second timeout

      // Clear timeout on successful load
      const originalOnload = link.onload;
      link.onload = () => {
        clearTimeout(timeout);
        originalOnload();
      };

      const originalOnerror = link.onerror;
      link.onerror = () => {
        clearTimeout(timeout);
        originalOnerror();
      };

      // Append to head
      if (document.head) {
        document.head.appendChild(link);
      } else {
        reject(new Error('Document head not available'));
      }
    });

    this.loadingPromises.set(cssId, promise);
    return promise;
  }

  /**
   * Preload CSS without blocking
   * @param {string} cssFile - CSS filename
   * @param {string} toolId - Tool identifier
   */
  preloadCSS(cssFile, toolId) {
    this.loadCSS(cssFile, toolId).catch(err => {
      console.warn('CSS preload failed:', err.message);
    });
  }

  /**
   * Check if CSS is loaded
   * @param {string} toolId - Tool identifier
   * @returns {boolean} True if CSS is loaded
   */
  isLoaded(toolId) {
    return this.loadedCSS.has(`${toolId}-css-link`);
  }

  /**
   * Unload CSS for a tool
   * @param {string} toolId - Tool identifier
   */
  unloadCSS(toolId) {
    const cssId = `${toolId}-css-link`;
    const link = document.getElementById(cssId);
    if (link) {
      link.remove();
    }
    this.loadedCSS.delete(cssId);
    this.loadingPromises.delete(cssId);
  }

  /**
   * Get loading status for debugging
   * @returns {Object} Current loading status
   */
  getStatus() {
    return {
      loaded: Array.from(this.loadedCSS),
      loading: Array.from(this.loadingPromises.keys())
    };
  }
}

// Create global CSS loader instance
window.cssLoader = window.cssLoader || new CSSLoader();

export default window.cssLoader;