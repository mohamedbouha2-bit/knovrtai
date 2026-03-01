'use client';

/**
 * إدارة الجلسات للمستخدمين والمسؤولين.
 * يدعم تعدد المستأجرين (Multi-tenancy) عبر عزل مفاتيح التخزين لكل مشروع.
 */

const canUseStorage = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

/**
 * توليد مفتاح فريد بناءً على معرف المشروع في الرابط.
 * مثال: /PROJ_123/dashboard -> PROJ_123_FrontendUserSession
 */
const getTenantSessionKey = (keyName: string): string => {
    if (!canUseStorage) return keyName;
    const proj = window.location.pathname.split('/').find(part => part.startsWith('PROJ_'));
    return proj ? `${proj}_${keyName}` : keyName;
};

// --- Frontend User Session ---

export class FrontendUserSession {
    token: string = '';
    userId: string = '';
    username: string = '';
    email: string = '';
    displayName: string = '';
    tier: string = '';
    credits: number = 0;
    locale: string = 'en';
}

let cachedFrontendUserSession: FrontendUserSession | null | undefined = undefined;

export function setFrontendUserSession(data: FrontendUserSession) {
    if (!canUseStorage) return;
    try {
        localStorage.setItem(getTenantSessionKey("FrontendUserSession"), JSON.stringify(data));
        cachedFrontendUserSession = data;
    } catch (e) {
        console.error("Failed to save frontend session", e);
    }
}

export function getFrontendUserSession(): FrontendUserSession | null {
    if (cachedFrontendUserSession !== undefined) return cachedFrontendUserSession;
    if (!canUseStorage) return (cachedFrontendUserSession = null);

    const data = localStorage.getItem(getTenantSessionKey("FrontendUserSession"));
    try {
        return (cachedFrontendUserSession = data ? JSON.parse(data) : null);
    } catch {
        return (cachedFrontendUserSession = null);
    }
}

export function removeFrontendUserSession() {
    if (!canUseStorage) return;
    localStorage.removeItem(getTenantSessionKey("FrontendUserSession"));
    cachedFrontendUserSession = null;
}

// --- Backend Admin Session ---

export class BackendAdminSession {
    token: string = '';
    adminId: string = '';
    adminName: string = '';
    role: string = '';
    permissions: string[] = [];
}

let cachedBackendAdminSession: BackendAdminSession | null | undefined = undefined;

export function setBackendAdminSession(data: BackendAdminSession) {
    if (!canUseStorage) return;
    try {
        localStorage.setItem(getTenantSessionKey("BackendAdminSession"), JSON.stringify(data));
        cachedBackendAdminSession = data;
    } catch (e) {
        console.error("Failed to save admin session", e);
    }
}

export function getBackendAdminSession(): BackendAdminSession | null {
    if (cachedBackendAdminSession !== undefined) return cachedBackendAdminSession;
    if (!canUseStorage) return (cachedBackendAdminSession = null);

    const data = localStorage.getItem(getTenantSessionKey("BackendAdminSession"));
    try {
        return (cachedBackendAdminSession = data ? JSON.parse(data) : null);
    } catch {
        return (cachedBackendAdminSession = null);
    }
}

export function removeBackendAdminSession() {
    if (!canUseStorage) return;
    localStorage.removeItem(getTenantSessionKey("BackendAdminSession"));
    cachedBackendAdminSession = null;
}

// Aliases for convenience
export const setfrontend_user_session = setFrontendUserSession;
export const getfrontend_user_session = getFrontendUserSession;
export const removefrontend_user_session = removeFrontendUserSession;

export const setbackend_admin_session = setBackendAdminSession;
export const getbackend_admin_session = getBackendAdminSession;
export const removebackend_admin_session = removeBackendAdminSession;