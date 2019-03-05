
const GATE_WAY = 'http://project.angle-tech.com.tw';
const GATE_WAY_PORT = '80';

export const environment = {
    production: false,
    envParamter: {
        MESSAGE_QUEUE: 'project.angle-tech.com.tw',
        MESSAGE_QUEUE_PORT: '5673',
        GATE_WAY: 'http://project.angle-tech.com.tw',
        GATE_WAY_PORT: '80',
        // I1_SERVER_SERVICE: `${GATE_WAY}:${GATE_WAY_PORT}/api/v1/tsw-i1-server`,
        // MARKETING_SERVICE: `${GATE_WAY}:${GATE_WAY_PORT}/api/v1/tsw-marketing-service`,
        I1_SERVER_SERVICE: 'http://localhost:8081/api/v1/tsw-i1-server',
        MARKETING_SERVICE: 'http://localhost:8082/api/v1/tsw-marketing-service',
        KINGDEE_ADAPTER: `${GATE_WAY}:${GATE_WAY_PORT}/api/v1/tsw-kingdee-adapter`,
    }
};
