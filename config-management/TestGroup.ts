export const TestGroups = {
    PRIORITY: {
        P0: '@p0', // Highest priority, must pass
        P1: '@p1', // Core features
        P2: '@p2', // Non-critical features
    },
    TYPE: {
        SMOKE: '@smoke',
        FLAKY: '@flaky', // Unstable test
        REGRESS: '@regress',
        E2E: '@e2e',
        INTEGRATION: '@integration',
    },
    FEATURE: {
        LOGIN: '@login',
        DIAGNOSIS: '@diagnosis',
    },
    UI: {
        DESKTOP: '@desktop',
        MOBILE: '@mobile',
        TABLET: '@tablet',
        RESPONSIVE: '@responsive',
    },
    ENVIRONMENT: {
        PROD: '@prod',
        STAGING: '@staging',
    },
};
