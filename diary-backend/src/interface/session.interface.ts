import {FileStore} from 'session-file-store';

interface cookie {
  httpOnly: boolean;
}
export interface sessionInterface {
  secret: string;
  resave: boolean;
  saveUninitialized: boolean;
  cookie: cookie;
  store: FileStore;
}
