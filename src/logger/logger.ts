import pino from 'pino';

const LOG_LEVEL = process.env.NEXT_PUBLIC_LOG_LEVEL ?? 'error'

interface RequestContext {
    requestId?: string
    sessionId?: string
}

declare global {
    interface Console {
        // ACI header removes console.log, but we capture it first
        log_orig: typeof console.log | undefined
    }
}

const logger = pino({
    level: LOG_LEVEL,
    timestamp: pino.stdTimeFunctions.isoTime,
    base: undefined,
    formatters: {
        level: (label) => {
            return { level: label.toUpperCase() };
        },
    },
    browser: {
        write: (o: unknown) => {
            const { context, ...log } = o as { context: RequestContext }
            const fn = console.log_orig ?? console.log
            fn({ ...context,...log})
        }
    }
})

export default logger
