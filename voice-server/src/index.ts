import { createServer, IncomingMessage, ServerResponse } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { StreamHandler } from "./stream-handler";

const PORT = parseInt(process.env.PORT ?? "8080", 10);

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  if (req.url === "/" || req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", service: "servin-tech-voice" }));
  } else {
    res.writeHead(404);
    res.end();
  }
});

const wss = new WebSocketServer({ server });

server.listen(PORT, () => {
  console.log(`[voice-server] Listening on port ${PORT}`);
});

wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
  const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);
  const orgId = url.searchParams.get("orgId") ?? "";

  console.log(`[voice-server] New Twilio Media Streams connection — orgId: ${orgId}`);

  const handler = new StreamHandler(ws, orgId);
  handler.start();

  ws.on("error", (err) => {
    console.error(`[voice-server] WebSocket error:`, err.message);
  });

  ws.on("close", () => {
    console.log(`[voice-server] Connection closed — orgId: ${orgId}`);
  });
});
