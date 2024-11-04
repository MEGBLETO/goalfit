import { Request, Response, NextFunction } from "express";
import { rateLimit, interval } from "../config";

const requestCounts: { [key: string]: number } = {};

// Reset request count for each IP address every 'interval' milliseconds
setInterval(() => {
  Object.keys(requestCounts).forEach((ip) => {
    requestCounts[ip] = 0; // Reset request count for each IP address
  });
}, interval);

export function rateLimitAndTimeout(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip; // Get client IP address
  console.log(ip)

  if (!ip) {
    return res.status(400).json({
      code: 400,
      status: "Error",
      message: "IP address is undefined.",
      data: null,
    });
  }

  // Update request count for the current IP
  requestCounts[ip] = (requestCounts[ip] || 0) + 1;

  // Check if request count exceeds the rate limit
  if (requestCounts[ip]! > rateLimit) {
    // Respond with a 429 Too Many Requests status code
    return res.status(429).json({
      code: 429,
      status: "Error",
      message: "Rate limit exceeded.",
      data: null,
    });
  }

  req.setTimeout(600000, () => {
    res.status(504).json({
      code: 504,
      status: "Error",
      message: "Gateway timeout.",
      data: null,
    });
    req.destroy();  
  });

  next(); 
}
