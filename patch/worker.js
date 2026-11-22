// Cloudflare Worker for hungzizc.com/patch*.
export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/patch") return Response.redirect(url.origin + "/patch/", 301);
    if (!url.pathname.startsWith("/patch/")) return new Response("Not found", { status: 404 });
    const path = url.pathname.slice(7) || "index.html";
    if (path.split("/").some((part) => part === "..")) return new Response("Not found", { status: 404 });
    const upstream = await fetch("https://raw.githubusercontent.com/hungzizc/3105/main/patch/" + path);
    if (!upstream.ok) return new Response("File not found", { status: upstream.status });
    const types = { html: "text/html; charset=utf-8", css: "text/css; charset=utf-8", js: "text/javascript; charset=utf-8", json: "application/json; charset=utf-8", svg: "image/svg+xml", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp", ico: "image/x-icon" };
    const ext = path.split(".").pop().toLowerCase();
    const headers = new Headers(upstream.headers);
    headers.set("Content-Type", types[ext] || "application/octet-stream");
    headers.set("Cache-Control", "no-store");
    return new Response(upstream.body, { status: 200, headers });
  }
};
