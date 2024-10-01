// eslint-disable-next-line no-undef
const { createProxyMiddleware } = require("http-proxy-middleware");

// src/setupProxy.jsx
// eslint-disable-next-line no-undef
module.exports = (app) => {
    app.use(
        "/api",
        createProxyMiddleware({
            target: "{http://localhost:8080}", // 비즈니스 서버 URL 설정
            changeOrigin: true,
        })
    );
};