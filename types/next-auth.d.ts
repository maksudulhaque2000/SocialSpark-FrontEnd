import { DefaultSession, DefaultUser } from 'next-auth';
import { User as AppUser } from './index';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    backendToken?: string;
    backendUser?: AppUser;
  }

  interface User extends DefaultUser {
    backendToken?: string;
    backendUser?: AppUser;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    backendToken?: string;
    backendUser?: AppUser;
  }
}
