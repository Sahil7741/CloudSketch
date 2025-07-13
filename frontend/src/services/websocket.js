import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { authUtils } from './api';

const WS_BASE_URL = process.env.REACT_APP_WS_URL || 'http://localhost:8080';

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.connected = false;
    this.subscriptions = new Map();
  }

  connect(onConnected, onError) {
    const token = authUtils.getToken();
    if (!token) {
      console.error('No JWT token found, cannot connect to WebSocket');
      if (onError) onError(new Error('No authentication token'));
      return;
    }

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(`${WS_BASE_URL}/ws/draw`),
      connectHeaders: {
        'Authorization': `Bearer ${token}`
      },
      debug: process.env.NODE_ENV === 'development' ? console.log : () => {},
      onConnect: (frame) => {
        console.log('Connected to WebSocket: ' + frame);
        console.log('STOMP client active:', this.stompClient.active);
        console.log('STOMP client methods:', Object.getOwnPropertyNames(this.stompClient));
        this.connected = true;
        if (onConnected) onConnected(frame);
      },
      onStompError: (error) => {
        console.error('WebSocket connection error: ', error);
        this.connected = false;
        if (onError) onError(error);
      },
    });

    this.stompClient.activate();
  }

  disconnect() {
    if (this.stompClient && this.connected) {
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
      this.subscriptions.clear();
      
      this.stompClient.deactivate();
      console.log('Disconnected from WebSocket');
      this.connected = false;
    }
  }

  subscribeToDrawing(onMessageReceived) {
    if (!this.connected || !this.stompClient || !this.stompClient.active) {
      console.error('Not connected to WebSocket or client not active');
      return null;
    }

    try {
      const subscription = this.stompClient.subscribe('/topic/board', (message) => {
        const drawingData = JSON.parse(message.body);
        if (onMessageReceived) {
          onMessageReceived(drawingData);
        }
      });

      this.subscriptions.set('drawing', subscription);
      return subscription;
    } catch (error) {
      console.error('Error subscribing to drawing updates:', error);
      return null;
    }
  }

  sendDrawingData(drawingData) {
    if (!this.stompClient) {
      console.error('STOMP client not initialized');
      return;
    }

    if (!this.stompClient.active) {
      console.error('STOMP client not active/connected');
      return;
    }

    if (!this.connected) {
      console.error('WebSocket not connected');
      return;
    }

    try {
      if (typeof this.stompClient.publish === 'function') {
        this.stompClient.publish({
          destination: '/app/draw',
          body: JSON.stringify(drawingData)
        });
      } 
      else if (typeof this.stompClient.send === 'function') {
        this.stompClient.send('/app/draw', {}, JSON.stringify(drawingData));
      } 
      else {
        console.error('Neither publish nor send method available on STOMP client');
      }
    } catch (error) {
      console.error('Error sending drawing data:', error);
    }
  }

  isConnected() {
    return this.connected;
  }
}

export default new WebSocketService();
