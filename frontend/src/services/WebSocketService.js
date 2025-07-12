import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.connected = false;
  }

  connect(onDrawingReceived, onUserJoined, onCanvasCleared) {
    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = Stomp.over(socket);
    
    this.stompClient.connect({}, () => {
      console.log('Connected to WebSocket');
      this.connected = true;
      
      this.stompClient.subscribe('/topic/drawing', (message) => {
        const drawingData = JSON.parse(message.body);
        onDrawingReceived(drawingData);
      });

      this.stompClient.subscribe('/topic/users', (message) => {
        const userData = JSON.parse(message.body);
        onUserJoined(userData);
      });

      this.stompClient.subscribe('/topic/clear', (message) => {
        const roomId = message.body;
        onCanvasCleared(roomId);
      });
    }, (error) => {
      console.error('WebSocket connection error:', error);
      this.connected = false;
    });
  }

  sendDrawingData(drawingData) {
    if (this.connected && this.stompClient) {
      this.stompClient.send('/app/draw', {}, JSON.stringify(drawingData));
    }
  }

  sendClearCanvas(roomId) {
    if (this.connected && this.stompClient) {
      this.stompClient.send('/app/clear', {}, roomId);
    }
  }

  joinRoom(userData) {
    if (this.connected && this.stompClient) {
      this.stompClient.send('/app/join', {}, JSON.stringify(userData));
    }
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect();
      this.connected = false;
    }
  }
}

export default new WebSocketService();
