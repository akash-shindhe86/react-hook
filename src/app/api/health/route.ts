import { NextResponse } from "next/server";

// To handle a GET request to /health-status
export async function GET(request: any) {
    // Returning Health Status for AKS
    return NextResponse.json({ status: 'ok' }, { status: 200 });
}
