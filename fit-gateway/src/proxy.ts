import { Application, Request, Response } from "express";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import { services } from "./config";
import authMiddleware from "./middleware/authMiddleware";
export function setupProxies(app: Application) {
  services.forEach(({ route, target, authRequired, paths }) => {
    if (paths) {
      paths.forEach(({ path, method, authRequired: pathAuthRequired = false }) => {
        const fullPath = `${route}${path}`;
        const proxyOptions: Options = {
          target,
          changeOrigin: true,
        };

        // const isAuthRequired = pathAuthRequired ?? authRequired; 
        const isAuthRequired = pathAuthRequired !== undefined ? pathAuthRequired : authRequired;

        
        console.log(`Setting up proxy for ${fullPath} (method: ${method.toUpperCase()})`);
        console.log(`Auth required: ${isAuthRequired}`);

        const middleware = isAuthRequired ? [authMiddleware, createProxyMiddleware(proxyOptions)] : [createProxyMiddleware(proxyOptions)];
        (app as any)[method.toLowerCase()](fullPath, ...middleware);
      });
    } else {
      const proxyOptions: Options = {
        target,
        changeOrigin: true,
      };

      console.log(`Setting up proxy for ${route}`);
      console.log(`Auth required: ${authRequired}`);

      const middleware = authRequired ? [authMiddleware, createProxyMiddleware(proxyOptions)] : [createProxyMiddleware(proxyOptions)];
      app.use(route, ...middleware);
    }
  });
}
