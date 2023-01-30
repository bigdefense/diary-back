import session from 'express-session';
import fileStore from 'session-file-store';

const FileStore = fileStore(session);
const sessionOptions: session.SessionOptions = {
  secret: 'secret key', // 암호화
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
  },
  store: new FileStore(),
};

export default session(sessionOptions);
