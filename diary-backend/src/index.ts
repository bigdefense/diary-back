import App from './app';
import Hello from './routes/hello.route';
import World from './routes/world.route';

const app = new App([new Hello(), new World()]);

app.listen();
