import App from './app';
import SSL from './routes/ssl.route';
import Users from './routes/users.route';
import World from './routes/world.route';
import Daily from './routes/daily.route';
import Monthly from './routes/monthly.route';
import Sticker from './routes/sticker.route';
import Weekly from './routes/weekly.route';

const app = new App([
  new Monthly(),
  new Weekly(),
  new Daily(),
  new SSL(),
  new World(),
  new Users(),
  new Sticker(),
]);

app.listen();
