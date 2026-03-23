/**
 * Generates an authenticated proxy URL for a document (PDF, images, etc.)
 * @param {string} fileURL - The original Cloudinary or external URL
 * @param {boolean} isDownload - Whether to force a download via Content-Disposition
 * @returns {string} - The authenticated proxy URL
 */
export const getProxyURL = (fileURL, isDownload = false) => {
    if (!fileURL) return '';
    
    // Only proxy Cloudinary URLs to avoid unnecessary overhead for other domains if any
    if (!fileURL.includes('cloudinary.com')) return fileURL;

    const token = localStorage.getItem('token');
    const encodedURL = encodeURIComponent(fileURL);
    let url = `http://localhost:5000/assignment/proxy-pdf?url=${encodedURL}&token=${token}`;
    
    if (isDownload) {
        url += '&download=true';
    }
    
    return url;
};
