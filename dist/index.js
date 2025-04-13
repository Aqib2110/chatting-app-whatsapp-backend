"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
wss.on("connection", (ws) => {
    ws.on("error", (err) => {
        console.log("error", err);
    });
    ws.on("message", (message) => {
        try {
            const data = JSON.parse(message.toString());
            console.log(data);
            if (data.type === "join" && data.roomCode) {
                ws.roomCode = data.roomCode;
                ws.isSentByMe = true;
                console.log(`Client joined room: ${data.roomCode}`);
                wss.clients.forEach((client) => {
                    if (client.readyState === client.OPEN &&
                        client.roomCode === ws.roomCode) {
                        client.send(JSON.stringify({
                            type: "join",
                            message: `You have joined room ${data.roomCode}`,
                            name: data.name,
                            isSentByMe: client.isSentByMe ? true : false,
                        }));
                        client.isSentByMe = false;
                    }
                });
                return;
            }
            else if (data.type === "leave" && data.roomCode) {
                wss.clients.forEach((client) => {
                    if (client.readyState === client.OPEN &&
                        client.roomCode === ws.roomCode) {
                        client.send(JSON.stringify({
                            type: "leave",
                            message: `You have leaved room ${data.roomCode}`,
                            name: data.name,
                        }));
                    }
                });
                return;
            }
            else if (data.type === "message" && data.message) {
                ws.isSentByMe = true;
                if (ws.roomCode) {
                    wss.clients.forEach((client) => {
                        if (client.readyState === client.OPEN &&
                            client.roomCode === ws.roomCode) {
                            client.send(JSON.stringify({
                                message: data.message,
                                isSentByMe: client.isSentByMe ? true : false,
                                name: data.name,
                            }));
                            client.isSentByMe = false;
                        }
                    });
                }
            }
        }
        catch (error) {
            console.log("Invalid message format", error);
        }
    });
    ws.on("close", () => {
        console.log("Client disconnected");
    });
});
