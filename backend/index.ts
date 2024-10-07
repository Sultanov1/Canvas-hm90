import express from "express";
import expressWs from "express-ws";
import cors from 'cors';
import crypto from 'crypto';
import { Connection, Draw, IncomingData } from "./types";

const app = express();
expressWs(app);

const port = 8000;

app.use(cors());

const router = express.Router();
const activeConnection: Connection = {};
let draw: Draw[] = [];

router.ws('/draw', (ws, _req) => {
  const id = crypto.randomUUID();
  console.log('User connected', id);
  activeConnection[id] = ws;

  ws.send(JSON.stringify({ type: 'Hello', payload: draw }));

  ws.on('message', (message) => {
    const parsedData = JSON.parse(message.toString()) as IncomingData;

    if (parsedData.type === 'DRAW_LINE') {
      draw.push(parsedData.payload);

      Object.values(activeConnection).forEach(connection => {
        const outgoingData = { type: 'DRAW_LINE', payload: draw };
        connection.send(JSON.stringify(outgoingData));
      });
    }

    if (parsedData.type === 'CLEAR') {
      draw = [];

      Object.values(activeConnection).forEach(connection => {
        const outgoingData = { type: 'CLEAR', payload: draw };
        connection.send(JSON.stringify(outgoingData));
      });
    }
  });

  ws.on('close', () => {
    console.log('User disconnected', id);
    delete activeConnection[id];
  });
});

app.use(router);

app.listen(port, () => {
  console.log(`Listening on port ${port} port`);
});
