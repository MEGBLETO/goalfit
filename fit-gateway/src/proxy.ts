import { Application, Request, Response } from "express";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import { services } from "./config";

export function setupProxies(app: Application) {
  services.forEach(({ route, target }) => {
    const proxyOptions: Options = {
      target
    };

    console.log('Proxy Options:', proxyOptions);

    app.use(route, createProxyMiddleware(proxyOptions));
  });
}
