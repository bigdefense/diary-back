import App from './app';
import Hello from './routes/hello.route';
import Users from './routes/users.route';
import World from './routes/world.route';
import Daily from './routes/daily.route';

const app = new App([new Daily(), new Hello(), new World(), new Users()]);

app.listen();
