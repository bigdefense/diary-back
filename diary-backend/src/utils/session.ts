import session from 'express-session';
import fileStore from 'session-file-store';
import {sessionInterface} from '@/interface/session.interface';
const FileStore = fileStore(session);

export const sessionOptions: sessionInterface = {
  secret: 'secret key', // 암호화
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
  },
  store: FileStore,
};
