import { createCookie } from '@remix-run/node';
import { CookieKey } from './constants';

export const walletCookieStore = createCookie(CookieKey);
export const getWalletCookie = async (
    request: Request
): Promise<{ address?: string }> => {
    const cookieHeader = request.headers.get('Cookie');
    const cookie = (await walletCookieStore.parse(cookieHeader)) || {};

    return cookie;
};
