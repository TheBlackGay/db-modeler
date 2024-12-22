import { MockServer } from './services/mockServer';
import { createStore } from './store';

const store = createStore();
const server = new MockServer(store);

server.start().catch(error => {
  console.error('Failed to start mock server:', error);
  process.exit(1);
}); 