#!/usr/bin/env python3
"""
Lightweight Python server for SmartEditor Studio.
Serves the production build and provides offline capability with zero external pip dependencies.
"""
import http.server
import socketserver
import os
import sys

PORT = int(os.environ.get("PORT", 3000))
DIST_DIR = os.path.join(os.path.dirname(__file__), "dist")


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST_DIR if os.path.exists(DIST_DIR) else ".", **kwargs)

    def do_GET(self):
        # SPA routing fallback: if file does not exist, serve index.html
        path = self.translate_path(self.path)
        if not os.path.exists(path) and not os.path.splitext(self.path)[1]:
            self.path = "/index.html"
        return super().do_GET()


def main():
    if not os.path.exists(DIST_DIR):
        print("⚠️  Warning: dist/ directory not found. Please run 'npm run build' first.")
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"🚀 SmartEditor Studio running at http://localhost:{PORT}")
        print("Press Ctrl+C to stop.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")


if __name__ == "__main__":
    main()
