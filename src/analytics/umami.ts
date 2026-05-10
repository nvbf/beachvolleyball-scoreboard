declare global {
    interface Window {
        umami?: {
            track: (eventName: string, eventData?: Record<string, string>) => void;
        };
    }
}

export type UmamiArea = 'tournaments' | 'tournament_view' | 'tournament_admin' | 'scoreboard';

const UMAMI_SCRIPT_ID = 'umami-tracker';
const UMAMI_SCRIPT_URL = 'https://cloud.umami.is/script.js';
const sessionKeys = new Set<string>();

function canUseBrowserStorage() {
    return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';
}

function getSessionKey(area: UmamiArea, params?: Record<string, string>) {
    const slug = params?.slug ? `:${params.slug}` : '';
    return `umami:${area}${slug}`;
}

export function initializeUmami() {
    if (typeof document === 'undefined') {
        return;
    }

    const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID;

    if (!websiteId || document.getElementById(UMAMI_SCRIPT_ID)) {
        return;
    }

    const script = document.createElement('script');
    script.id = UMAMI_SCRIPT_ID;
    script.defer = true;
    script.src = UMAMI_SCRIPT_URL;
    script.setAttribute('data-website-id', websiteId);
    document.head.appendChild(script);
}

export function trackAreaVisit(area: UmamiArea, params?: Record<string, string>) {
    if (typeof window === 'undefined' || typeof window.umami?.track !== 'function') {
        return;
    }

    const sessionKey = getSessionKey(area, params);

    if (sessionKeys.has(sessionKey)) {
        return;
    }

    if (canUseBrowserStorage()) {
        if (window.sessionStorage.getItem(sessionKey)) {
            sessionKeys.add(sessionKey);
            return;
        }

        window.sessionStorage.setItem(sessionKey, '1');
    }

    sessionKeys.add(sessionKey);
    window.umami.track(area, params);
}

export { };