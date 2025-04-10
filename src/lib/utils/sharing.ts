// src/lib/utils/sharing.ts
import { browser } from '$app/environment';
import { i18n } from '$lib/i18n';
import { get } from 'svelte/store';

export interface ShareOptions {
	url?: string;
	title?: string;
	text?: string;
	hashtags?: string[];
	via?: string;
}

/**
 * Detect platform capabilities
 */
export const getShareCapabilities = () => {
	if (!browser) return { webShare: false, clipboard: false };

	return {
		webShare: !!navigator.share,
		clipboard: !!navigator.clipboard,
		isIOS: /iPhone|iPad|iPod/.test(navigator.userAgent),
		isAndroid: /Android/.test(navigator.userAgent),
		isMobile: /Mobi|Android/i.test(navigator.userAgent)
	};
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
	if (!browser) return false;

	try {
		if (navigator.clipboard) {
			await navigator.clipboard.writeText(text);
			return true;
		} else {
			// Fallback for older browsers
			const textArea = document.createElement('textarea');
			textArea.value = text;
			textArea.style.position = 'fixed';
			document.body.appendChild(textArea);
			textArea.focus();
			textArea.select();

			const successful = document.execCommand('copy');
			document.body.removeChild(textArea);
			return successful;
		}
	} catch (err) {
		console.error('Failed to copy text: ', err);
		return false;
	}
};

const i18nContent = get(i18n);

/**
 * Share content using Web Share API if available
 * This is the renamed nativeShare function to match the import in SuccessContent.svelte
 */
export const shareContent = async (options: ShareOptions): Promise<boolean> => {
	if (!browser || !navigator.share) return false;

	try {
		const shareData: ShareData = {
			url: options.url || window.location.href,
			title: i18nContent.modal.success.shareContent.title || document.title,
			text: i18nContent.modal.success.shareContent.text || ''
		};

		await navigator.share(shareData);
		return true;
	} catch (err) {
		console.error('Error using native share:', err);
		return false;
	}
};

// Keep nativeShare as an alias for backward compatibility
export const nativeShare = shareContent;

/**
 * Share to a specific platform
 */
export const shareTo = (platform: string, options: ShareOptions): boolean => {
	if (!browser) return false;

	const url = options.url || window.location.href;
	const title = i18nContent.modal.success.shareContent.title || document.title;
	const text = i18nContent.modal.success.shareContent.text || '';
	const hashtags = options.hashtags || [];

	const encodedUrl = encodeURIComponent(url);
	const encodedTitle = encodeURIComponent(title);
	const encodedText = encodeURIComponent(text);
	const encodedHashtags = hashtags.length ? encodeURIComponent(hashtags.join(',')) : '';

	let shareUrl = '';

	switch (platform) {
		case 'facebook':
			shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
			break;
		case 'twitter':
			shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
			if (encodedHashtags) shareUrl += `&hashtags=${encodedHashtags}`;
			if (options.via) shareUrl += `&via=${encodeURIComponent(options.via)}`;
			break;
		case 'linkedin':
			shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
			break;
		case 'whatsapp':
			shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
			break;
		case 'telegram':
			shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
			break;
		case 'reddit':
			shareUrl = `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`;
			break;
		case 'email':
			shareUrl = `mailto:?subject=${encodedTitle}&body=${encodedText}%20${encodedUrl}`;
			break;
		case 'copy':
			copyToClipboard(`${title}\n${text}\n${url}`);
			return true;
		default:
			return false;
	}

	if (shareUrl) {
		window.open(shareUrl, '_blank', 'noopener,noreferrer');
		return true;
	}

	return false;
};

/**
 * Get a list of share platforms based on device
 */
export const getSharePlatforms = (): string[] => {
	const capabilities = getShareCapabilities();
	const platforms = ['facebook', 'twitter', 'linkedin', 'reddit', 'email', 'copy'];

	if (capabilities.isMobile) {
		platforms.unshift('whatsapp', 'telegram');
	}

	return platforms;
};
