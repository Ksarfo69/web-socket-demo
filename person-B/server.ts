import { WebSocket } from 'ws';
import readLine from 'readline';

const ws = new WebSocket("ws://localhost:3000/message/2");

ws.on('open', () => 
{
    console.log("Web Socket connected.");
})

ws.on('message', (message) => 
{
    console.log(message.toString());
})


const sendMessage = (message: string, recepient: string) =>
{
    const payload = {
        recepient: recepient,
        message: message
    }

    ws.send(JSON.stringify(payload));
}

const rl = readLine.createInterface(
    {
        input: process.stdin,
        output: process.stdout
    }
)

rl.question('Type userId to send a message to', (userId: string) =>
{
    startLoop(userId);
})

const startLoop = (userId: string) => 
{
    rl.on('line', (message: string) => 
    {
        sendMessage(message, userId);
    })
}

