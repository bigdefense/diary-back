import session from 'express-session';
import fileStore from 'session-file-store';

const FileStore = fileStore(session);
const sessionOptions: session.SessionOptions = {
  secret: 'secret key', // 암호화
  resave: false,
  saveUninitialized: true,
  cookie: {
    path: '/',
    sameSite: 'none',
    httpOnly: true,
    secure: true,
    maxAge: 3600000,
  },
  store: new FileStore(),
};

export default session(sessionOptions);
