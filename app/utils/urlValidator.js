export function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

export function isHttpsUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

export function validateWebsiteUrl(url) {
    if (!url || url.trim() === '') {
        return { valid: false, error: 'Please enter a URL' };
    }

    if (!isValidUrl(url)) {
        return { valid: false, error: 'Please enter a valid URL (https://example.com)' };
    }

    if (!isHttpsUrl(url)) {
        return { valid: false, error: 'Only HTTPS URLs are supported for security reasons' };
    }

    // Vérifier que ce n'est pas localhost ou IP locale en production
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname.toLowerCase();
        
        if (hostname === 'localhost' || 
            hostname === '127.0.0.1' || 
            hostname.startsWith('192.168.') ||
            hostname.startsWith('10.') ||
            hostname.startsWith('172.')) {
            return { valid: false, error: 'Local URLs are not supported' };
        }
    } catch (_) {
        return { valid: false, error: 'Invalid URL format' };
    }

    return { valid: true };
}