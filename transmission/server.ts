import express, { Request } from 'express';
import dotenv from 'dotenv';
import expressWs, { Application } from 'express-ws';
import { WebSocket } from 'ws';

dotenv.config();

const app = express();
const wsInstance= expressWs(app);

const socketApp: Application = wsInstance.app;

const connections = new Map();

socketApp.ws("/message/:id", (ws: WebSocket, req: Request) => 
{
    const sender = req.params.id;
    
    connections.set(sender, ws);
    console.log(`Connection from sender ${sender} added`);
    ws.on('message', (msg: string) => 
    {
        // console.log(message);
        const {recepient, message } = JSON.parse(msg);

        if(connections.has(recepient))
        {
            const recepientWs: WebSocket = connections.get(recepient);
            if(recepientWs != ws && recepientWs.readyState)
            {
                console.log(`Sending message ${message}`);
                recepientWs.send(message);
            }
        }
    })

})

socketApp.listen(process.env.PORT, () => 
{
    console.log(`Server running on port ${process.env.PORT}`);
})

