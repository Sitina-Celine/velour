// Vite settings.
// - React plugin for the .jsx files
// - Two pages: the funnel page and the thank-you page
// - A small plugin that runs the /api server functions during "npm run dev",
//   the same way Vercel runs them when the site is live

import fs from "node:fs";
import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

function apiFunctionsInDev() {
  return {
    name: "api-functions-in-dev",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith("/api/")) return next();

        const url = new URL(req.url, "http://localhost");
        const name = url.pathname.replace(/^\/api\//, "").replace(/\/$/, "");
        const file = path.join(server.config.root, "api", `${name}.js`);

        // Only simple names like "order" or "create-checkout", and only files that exist
        if (!/^[a-z0-9-]+$/i.test(name) || !fs.existsSync(file)) {
          res.statusCode = 404;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Not found" }));
          return;
        }

        try {
          // Read a JSON body for POST requests, like Vercel does
          let body;
          if (req.method !== "GET" && req.method !== "HEAD") {
            const chunks = [];
            for await (const chunk of req) chunks.push(chunk);
            const raw = Buffer.concat(chunks).toString();
            try {
              body = raw ? JSON.parse(raw) : {};
            } catch {
              body = raw;
            }
          }
          req.body = body;
          req.query = Object.fromEntries(url.searchParams);

          // The two response helpers the functions use on Vercel
          res.status = (code) => {
            res.statusCode = code;
            return res;
          };
          res.json = (data) => {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(data));
            return res;
          };

          // Load the latest version of the function, so edits apply without a restart
          const fn = await server.ssrLoadModule(`/api/${name}.js`);
          await fn.default(req, res);
        } catch (error) {
          server.config.logger.error(`[api/${name}] ${error.stack || error}`);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Server function failed" }));
          }
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Make .env.local values (STRIPE_SECRET_KEY, LEADS_WEBHOOK_URL) available to the server functions only
  const env = loadEnv(mode, process.cwd(), "");
  for (const [key, value] of Object.entries(env)) {
    if (!(key in process.env)) process.env[key] = value;
  }

  return {
    plugins: [react(), apiFunctionsInDev()],
    build: {
      rolldownOptions: {
        input: {
          main: path.resolve(process.cwd(), "index.html"),
          thankYou: path.resolve(process.cwd(), "thank-you.html"),
        },
      },
    },
  };
});
