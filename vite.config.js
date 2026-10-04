import 'dotenv/config'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { promises as fs } from 'fs'
import path from 'path'
import url from 'url'

function localApiPlugin() {
  return {
    name: 'local-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url.startsWith('/api')) {
          try {
            const parsedUrl = url.parse(req.url, true);
            const pathname = parsedUrl.pathname;
            
            // Map all /api requests through unified router api/[...slug].js
            const filePath = path.join(process.cwd(), 'api', '[...slug].js');
            
            // Parse body if POST/PUT
            let body = {};
            if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
              const buffers = [];
              for await (const chunk of req) {
                buffers.push(chunk);
              }
              const rawBody = Buffer.concat(buffers).toString();
              if (rawBody) {
                try {
                  body = JSON.parse(rawBody);
                } catch {
                  body = rawBody;
                }
              }
            }
            
            // Import the handler dynamically with a cache-busting query parameter
            const moduleUrl = url.pathToFileURL(filePath).href + `?update=${Date.now()}`;
            const { default: handler } = await import(moduleUrl);
            
            const mockReq = {
              url: req.url,
              method: req.method,
              headers: req.headers,
              query: parsedUrl.query,
              body: body,
            };
            
            const mockRes = {
              statusCode: 200,
              headers: {},
              setHeader(name, value) {
                this.headers[name.toLowerCase()] = value;
                res.setHeader(name, value);
                return this;
              },
              getHeader(name) {
                return this.headers[name.toLowerCase()] || (res.getHeader ? res.getHeader(name) : undefined);
              },
              status(code) {
                this.statusCode = code;
                res.statusCode = code;
                return this;
              },
              write(chunk) {
                res.write(chunk);
                return this;
              },
              json(data) {
                this.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
                return this;
              },
              end(data) {
                res.end(data);
                return this;
              },
              send(data) {
                res.end(data);
                return this;
              }
            };
            
            await handler(mockReq, mockRes);
          } catch (err) {
            console.error('Error in local API middleware:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Internal Server Error', details: err.message }));
          }
          return;
        }
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), localApiPlugin()],
  server: {
    host: true, // Listen on all local IPs
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three')) return 'vendor-three';
            if (id.includes('framer-motion')) return 'vendor-framer';
            if (id.includes('lucide-react')) return 'vendor-icons';
            if (id.includes('react') || id.includes('scheduler') || id.includes('react-router')) return 'vendor-react';
          }
        }
      }
    }
  }
})
