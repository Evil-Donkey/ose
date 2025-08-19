/**
 * Utility function to handle secure file downloads
 * @param {string} fileUrl - The original file URL from WordPress
 * @param {string} fileName - The display name of the file
 * @returns {Promise<void>}
 */
export const downloadFile = async (fileUrl, fileName) => {
  try {
    // Create the download URL using our secure proxy
    const downloadUrl = `/api/download?url=${encodeURIComponent(fileUrl)}`;
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName || 'download';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
  } catch (error) {
    console.error('Download error:', error);
    // You could show a toast notification here
    alert('Download failed. Please try again.');
  }
};

/**
 * Check if a file URL is from a protected directory
 * @param {string} fileUrl - The file URL to check
 * @returns {boolean}
 */
export const isProtectedFile = (fileUrl) => {
  if (!fileUrl) return false;
  return fileUrl.includes('/protected/') || fileUrl.includes('/wp-content/uploads/protected/');
};
