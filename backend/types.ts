import {WebSocket} from 'ws';

export interface Draw {
  coordinateX: string;
  coordinateY: string;
  color: string;
}

export interface Connection {
  [id: string]: WebSocket;
}

export interface IncomingData {
  type: string;
  payload: Draw;
}