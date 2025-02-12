import { headers } from 'next/headers';
import { Suspense } from 'react';
import Head from '@/server/components/Head';
import Header from '@/server/components/Header';
import Footer from '@/server/components/Footer';
import aemService from "@/server/services/aem";
import { RouteProvider } from "@/client/components/index";
import { replaceBanner } from "@/server/services/utils";
import { AppVersionType } from '@/server/services/types';
import '@/styles/app.css';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const banner: string = aemService.getAEM().banner;
    const AEMConfig = aemService.getAEM().config!;
    const env = aemService.getEnvFromHost();
    const url: string = headers().get('url') || "";

    const baseDomainUrl = AEMConfig?.baseDomainUrl.includes('www-stage') ? AEMConfig?.baseDomainUrl.replace('www-stage', 'www') : AEMConfig?.baseDomainUrl.includes('business-stage') ? AEMConfig?.baseDomainUrl.replace('business-stage', 'business') : AEMConfig?.baseDomainUrl;
    const aemCheckSumVersion: AppVersionType = await aemService.getCheckSum(banner, baseDomainUrl+AEMConfig?.checkSumUrl);
    const onloadEventHtml: string = await aemService.getOnLoadEvents(replaceBanner(baseDomainUrl+AEMConfig.aemOnLoadEventHTML, banner), aemCheckSumVersion['on-load-event']);

    return (
    <html lang="en">
      <Head onloadEventHtml={onloadEventHtml} />
      <body className="main-wrapper">
      <Header version={aemCheckSumVersion.header}/>
      <RouteProvider banner={banner} config={AEMConfig} env={env}>
        {children}
      </RouteProvider>
      <Footer version={aemCheckSumVersion.footer}/>
      </body>
    </html>
    )
}
