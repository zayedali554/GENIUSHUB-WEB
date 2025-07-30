// Genius Hub Access Control System
// Netlify Functions Compatible Version

const ACCESS_CONFIG = {
  ENABLE_ACCESS_CONTROL: true, // Set to true to activate
  ACCESS_DURATION: 48 * 60 * 60 * 1000, // 48 hours in milliseconds
  STORAGE_KEY: 'genius_hub_access',
  GENERATE_KEY_PAGE: '/generate-key.html'
};

class AccessControl {
  constructor() {
    this.init();
  }

  init() {
    // Only run if access control is enabled
    if (!ACCESS_CONFIG.ENABLE_ACCESS_CONTROL) {
      console.log('🔓 Access Control: DISABLED');
      return;
    }

    console.log('🔒 Access Control: ENABLED');
    
    // Don't check access on the generate key page itself
    if (window.location.pathname.includes('generate-key.html')) {
      return;
    }

    this.checkAccess();
  }

  checkAccess() {
    try {
      const accessData = localStorage.getItem(ACCESS_CONFIG.STORAGE_KEY);
      
      if (!accessData) {
        console.log('🚫 No access key found');
        this.redirectToGenerateKey();
        return;
      }

      const { key, timestamp, expiresAt } = JSON.parse(accessData);
      const now = Date.now();

      if (now >= expiresAt) {
        console.log('⏰ Access key expired');
        localStorage.removeItem(ACCESS_CONFIG.STORAGE_KEY);
        this.redirectToGenerateKey();
        return;
      }

      const remainingTime = expiresAt - now;
      const remainingHours = Math.floor(remainingTime / (60 * 60 * 1000));
      const remainingMinutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));

      console.log(`✅ Access granted! ${remainingHours}h ${remainingMinutes}m remaining`);
      console.log(`🔑 Access Key: ${key}`);

      // Optional: Show access status in UI
      this.showAccessStatus(remainingHours, remainingMinutes);

    } catch (error) {
      console.error('❌ Error checking access:', error);
      localStorage.removeItem(ACCESS_CONFIG.STORAGE_KEY);
      this.redirectToGenerateKey();
    }
  }

  redirectToGenerateKey() {
    console.log('🔄 Redirecting to Generate Key page...');
    
    // Store current page to return after access is granted
    sessionStorage.setItem('genius_hub_return_url', window.location.href);
    
    // Redirect to generate key page
    window.location.href = ACCESS_CONFIG.GENERATE_KEY_PAGE;
  }

  showAccessStatus(hours, minutes) {
    // Create access status indicator (optional)
    if (document.body && !document.getElementById('access-status')) {
      const statusDiv = document.createElement('div');
      statusDiv.id = 'access-status';
      statusDiv.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: linear-gradient(135deg, #28a745, #20c997);
        color: white;
        padding: 8px 15px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
        cursor: pointer;
        transition: all 0.3s ease;
      `;
      statusDiv.innerHTML = `🔑 Access: ${hours}h ${minutes}m`;
      statusDiv.title = 'Click to view access details';
      
      statusDiv.onclick = () => {
        this.showAccessDetails();
      };
      
      document.body.appendChild(statusDiv);
    }
  }

  showAccessDetails() {
    try {
      const accessData = JSON.parse(localStorage.getItem(ACCESS_CONFIG.STORAGE_KEY));
      const expiryDate = new Date(accessData.expiresAt);
      
      alert(`🔑 Access Key Details:\n\nKey: ${accessData.key}\nExpires: ${expiryDate.toLocaleString()}\nGenerated: ${new Date(accessData.timestamp).toLocaleString()}`);
    } catch (error) {
      console.error('Error showing access details:', error);
    }
  }

  // Method to manually grant access (for testing)
  static grantAccess(customKey = null) {
    const accessKey = customKey || 'TEST_' + Math.random().toString(36).substr(2, 12).toUpperCase();
    const accessData = {
      key: accessKey,
      timestamp: Date.now(),
      expiresAt: Date.now() + ACCESS_CONFIG.ACCESS_DURATION
    };
    
    localStorage.setItem(ACCESS_CONFIG.STORAGE_KEY, JSON.stringify(accessData));
    console.log('✅ Access granted manually:', accessKey);
    
    return accessKey;
  }

  // Method to revoke access (for testing)
  static revokeAccess() {
    localStorage.removeItem(ACCESS_CONFIG.STORAGE_KEY);
    console.log('🚫 Access revoked');
  }

  // Method to check access status (for testing)
  static checkStatus() {
    try {
      const accessData = localStorage.getItem(ACCESS_CONFIG.STORAGE_KEY);
      
      if (!accessData) {
        console.log('🚫 No access');
        return false;
      }

      const { key, timestamp, expiresAt } = JSON.parse(accessData);
      const now = Date.now();

      if (now >= expiresAt) {
        console.log('⏰ Access expired');
        return false;
      }

      const remainingTime = expiresAt - now;
      const remainingHours = Math.floor(remainingTime / (60 * 60 * 1000));
      const remainingMinutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));

      console.log(`✅ Access active: ${remainingHours}h ${remainingMinutes}m remaining`);
      console.log(`🔑 Key: ${key}`);
      
      return true;
    } catch (error) {
      console.error('❌ Error checking status:', error);
      return false;
    }
  }
}

// Initialize access control when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new AccessControl();
  });
} else {
  new AccessControl();
}

// Expose utility methods globally for testing
window.AccessControl = AccessControl;

// Console helper commands
console.log(`
🔑 Genius Hub Access Control Commands:
- AccessControl.grantAccess() - Grant 48h access
- AccessControl.revokeAccess() - Remove access
- AccessControl.checkStatus() - Check current status
`);

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AccessControl;
}
