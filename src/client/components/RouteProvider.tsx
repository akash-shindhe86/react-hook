"use client";
import React from "react";
import { useRouter } from 'next/navigation';
import { StoreProvider } from "@/client/components/index";

const RouteProvider = ({ children, banner, config, env }: { children: React.ReactNode, banner: string, config: any, env: string }) => {
    const router = useRouter();
    return (
        <StoreProvider banner={banner} config={config} router={router} env={env}>
            {children}
        </StoreProvider>
    );
};



export default RouteProvider;
