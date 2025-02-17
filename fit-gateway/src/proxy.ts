import { Application, Request, Response } from "express";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import { services } from "./config";
import authMiddleware from "./middleware/authMiddleware";

console.log(services, "services")
export function setupProxies(app: Application) {
  services.forEach(({ route, target, authRequired, paths }) => {
    console.log(paths, "hehehehheh")
    console.log(route, "hehehehheh")
    if (paths) {
      paths.forEach(({ path, method, authRequired: pathAuthRequired }) => {
        console.log(path, method, "first")
        const fullPath = `${route}${path}`;
        console.log(fullPath, "paths");
        const proxyOptions: Options = {
          target,
          changeOrigin: true,
        };

        console.log('Proxy Options:', proxyOptions);

        const middleware = pathAuthRequired ? [authMiddleware, createProxyMiddleware(proxyOptions)] : [createProxyMiddleware(proxyOptions)];
        (app as any)[method.toLowerCase()](fullPath, ...middleware);
      });
    } else {
      const proxyOptions: Options = {
        target,
        changeOrigin: true,
      };

      console.log('Proxy Options:', proxyOptions);

      const middleware = authRequired ? [authMiddleware, createProxyMiddleware(proxyOptions)] : [createProxyMiddleware(proxyOptions)];
      app.use(route, ...middleware);
    }
  });
}
