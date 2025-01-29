const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
app.use(cors());

app.use(
  "/firebase",
  createProxyMiddleware({
    target: "https://doctorappointmentsystem-695f7-default-rtdb.europe-west1.firebasedatabase.app",
    changeOrigin: true,
    pathRewrite: { "^/firebase": "" }, 
  })
);

app.use(
  "/api",
  createProxyMiddleware({
    target: "http://localhost:5000", 
    changeOrigin: true,
  })
);

const PORT = 4000; 
app.listen(PORT, () => {
  console.log(`🚀 API Gateway çalışıyor: http://localhost:${PORT}`);
});
