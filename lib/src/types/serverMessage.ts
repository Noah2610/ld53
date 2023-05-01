import { Vector } from ".";
import { AuthedMessage, BaseMessage } from "./message";

export interface ServerMessagePong {
    type: "pong";
}

export interface ServerMessageAuth {
    type: "auth";
    auth: string;
    id: string;
}

export interface ServerMessagePlayerJoin extends AuthedMessage {
    type: "playerJoin";
    payload: {
        id: string;
        name: string;
        position: Vector;
    }[];
}

export interface ServerMessagePlayerLeave extends AuthedMessage {
    type: "playerLeave";
    payload: { id: string }[];
}

export interface ServerMessagePlayerPosition extends AuthedMessage {
    type: "playerPosition";
    payload: {
        id: string;
        position: Vector;
    }[];
}

export interface ServerMessagePlayerName extends AuthedMessage {
    type: "playerName";
    payload: {
        id: string;
        name: string;
    }[];
}

export type ServerMessage = BaseMessage &
    (
        | ServerMessagePong
        | ServerMessageAuth
        | ServerMessagePlayerJoin
        | ServerMessagePlayerLeave
        | ServerMessagePlayerPosition
        | ServerMessagePlayerName
    );
