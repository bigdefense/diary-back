import App from './app';
import SSL from './routes/ssl.route';
import Users from './routes/users.route';
import World from './routes/world.route';
import Daily from './routes/daily.route';
import Monthly from './routes/monthly.route';

const app = new App([
  new Monthly(),
  new Daily(),
  new SSL(),
  new World(),
  new Users(),
]);

app.listen();
