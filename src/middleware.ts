import { NextRequest, NextResponse } from 'next/server';
import aemService from "@/server/services/aem";
import { getCacheTag } from "@/server/services/utils";

export function middleware(request: NextRequest) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('url', request.url);

    const response = NextResponse.next({
        request: {
            headers: requestHeaders
        }
    });

    const referer = requestHeaders.get('referer');

    // Set Edge-Cache-Tag for PDP pages for all environments
    if(request.nextUrl.href.includes('/product/details') || request.nextUrl.href.includes('/product/_DST')) {
        let url = request.nextUrl.href;
        // If the request is for DST page, get the bpn from the referer
        if(request.nextUrl.href.includes('/product/_DST') && referer) {
            url = referer;
        }

        const params = url.split('?')[0].split('/');
        const bpn = params[params.length - 1];
        const banner: string = aemService.getAEM().banner!;
        const env = aemService.getEnvFromHost(true);
        const cacheTag = getCacheTag(request.nextUrl.href, referer, bpn, banner, env);
        response.headers.set('Edge-Cache-Tag', cacheTag);
    }

    return response;
}
