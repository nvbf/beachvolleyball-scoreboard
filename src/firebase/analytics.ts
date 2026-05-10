import { logEvent } from 'firebase/analytics';
import { analytics } from './firebase-config';

export type AnalyticsArea = 'tournaments' | 'tournament_view' | 'tournament_admin' | 'scoreboard';

/**
 * Track a screen/page view for a given area of the app.
 * No personal data is collected — Firebase assigns an anonymous app_instance_id.
 */
export function trackPageView(area: AnalyticsArea, params?: Record<string, string>) {
    logEvent(analytics, 'page_view', {
        page_title: area,
        ...params,
    });
}
