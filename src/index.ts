// import { WebSocketServer } from "ws";
// const wss = new WebSocketServer({port:8080});
// wss.on("connection", (ws) => {
//     ws.on("error",(err)=>{
//         console.log("error",err);
//     });
//     ws.on("message", (message) => {
//         try {
//           const data = JSON.parse(message.toString());
//          if (data.type === "join" && data.roomCode) 
//           {
//             (ws as any).roomCode = data.roomCode;
//             (ws as any).isSentByMe = true;
//             console.log(`Client joined room: ${data.roomCode}`);
//             wss.clients.forEach((client: any) => {
//               if (
//                 client.readyState === client.OPEN &&
//                 client.roomCode === (ws as any).roomCode 
//               ){
//                 client.send(JSON.stringify({
//                   type: "join",
//                   message: `You have joined room ${data.roomCode}`,
//                   name:data.name,
//                   isSentByMe:client.isSentByMe ? true : false,
//                 }));
//                 client.isSentByMe = false;
//               }})
//             return;
//           }
//           else if (data.type === "leave" && data.roomCode) {

//             wss.clients.forEach((client: any) => {
//               if (
//                 client.readyState === client.OPEN &&
//                 client.roomCode === (ws as any).roomCode 
//               ){
//                 client.send(JSON.stringify({
//                   type: "leave",
//                   message: `You have leaved room ${data.roomCode}`,
//                   name:data.name,
//                 }));
               
//               }})
//             return;


//           }
//     else if(data.type === "message" && data.message) {
//       (ws as any).isSentByMe = true;
//         if ((ws as any).roomCode) {
//             wss.clients.forEach((client: any) => {
//               if (
//                 client.readyState === client.OPEN &&
//                 client.roomCode === (ws as any).roomCode 
//               ){
//                 client.send(JSON.stringify({
//                   message:data.message,
//                   isSentByMe:client.isSentByMe ? true : false,
//                   name:data.name,
//                 }));
//                 client.isSentByMe = false;
//               }
//             });
//           }
//     }      
//         } catch (error) {
//           console.log("Invalid message format", error);
//         }
//       });
    
//       ws.on("close", () => {
//         console.log("Client disconnected");
//       });
//     });