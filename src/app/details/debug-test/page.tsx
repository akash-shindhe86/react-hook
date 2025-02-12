import React from "react";
// @ts-ignore
import aemService from "@/server/services/aem";

export default function debugTestPage() {
    const headers =  aemService.getRequestHeaders();

    return (
        <main className="main-wrapper">
            <div className="full-bleed-container">
                <div className="full-bleed-row">
                    {headers}
                </div>
            </div>
        </main>
    )
}

