import { createAction } from 'redux-actions';
import { Socket } from 'phoenix-socket';
import redux from 'js/redux-store';

import { processMessage } from './message-processor';

export const ACTION_CABLE_CONNECT = 'ACTION_CABLE_CONNECT';
export const ACTION_CABLE_DISCONNECT = 'ACTION_CABLE_DISCONNECT';

export const ACTION_CABLE_CONNECTED = 'ACTION_CABLE_CONNECTED';
export const ACTION_CABLE_DISCONNECTED = 'ACTION_CABLE_DISCONNECTED';
export const ACTION_CABLE_REJECTED = 'ACTION_CABLE_REJECTED';
export const ACTION_CABLE_RECEIVED = 'ACTION_CABLE_RECEIVED';
export const ACTION_CABLE_SEND_MESSAGE = 'ACTION_CABLE_SEND_MESSAGE';

export const connect = createAction(ACTION_CABLE_CONNECT);
export const disconnect = createAction(ACTION_CABLE_DISCONNECT);
export const connected = createAction(ACTION_CABLE_CONNECTED);
export const disconnected = createAction(ACTION_CABLE_DISCONNECTED);
export const rejected = createAction(ACTION_CABLE_REJECTED);
export const received = createAction(ACTION_CABLE_RECEIVED);
export const sendMessage = createAction(ACTION_CABLE_SEND_MESSAGE);

function cableConnected(cable, dispatch) {
  return () => {
    dispatch(connected(cable));
  };
}

function cableRejected(dispatch) {
  return data => {
    console.log('rejected', data);
    dispatch(rejected(data));
  };
}

function cableReceived(dispatch) {
  // data is the relay format:
  // {
  //   uid: uid,
  //   message: actual message
  // }
  return data => {
    dispatch(received({ data }));
    dispatch(processMessage(data));
  };
}

let socket = null;
let channel = null;

// data should already be encrypted
export function send(to, data) {
  redux.dispatch(sendMessage({ to, data }));

  const payload = { to, message: data };

  return channel.push('chat', payload);
}

export function connectToCable() {
  return (dispatch, getState) => {
    const state = getState();
    const { config } = state.identity;
    const { uid, relays } = config;
    const firstRelay = relays[0];
    const url = firstRelay.url;

    if (state.network.actionCable.status === ACTION_CABLE_CONNECTED) {
      return;
    }

    dispatch(connect());

    socket = new Socket(url, { params: { uid } });
    socket.onError(() => console.log('socket: there was an error with the connection!'));
    socket.onClose(() => console.log('socket: the connection dropped'));
    socket.connect();
    channel = socket.channel(`user:${uid}`, {});
    channel.onError(() => {
      console.log('channel: there was an error!');
      socket.disconnect();
    });
    channel.onClose(() => {
      console.log('channel: the channel has gone away gracefully');
      socket.disconnect();
    });
    channel
      .on('chat', cableReceived(dispatch));
    channel
      .join()
      .receive('ok', cableConnected(channel, dispatch))
      .receive('error', cableRejected(dispatch));
  };
}
