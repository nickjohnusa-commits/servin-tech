import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";
import { StreamHandler } from "./stream-handler";

const PORT = parseInt(process.env.PORT ?? "8080", 10);
const wss = new WebSocketServer({ port: PORT });

console.log(`[voice-server] WebSocket server started on port ${PORT}`);

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
