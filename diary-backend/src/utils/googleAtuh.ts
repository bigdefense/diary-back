import axios from 'axios';
import qs from 'qs';
import {OAUTH} from '../config/oatuh';
import {GoogleOauthToken} from '../interface/googleOauthToken';
import {GoogleUserResult} from '../interface/googleUserResult';

export class utilGoogle {
  public getGoogleOauthToken = async ({
    code,
    redirect_uri,
  }: {
    code: string;
    redirect_uri: string;
  }): Promise<GoogleOauthToken> => {
    const rootURl = 'https://oauth2.googleapis.com/token';

    const options = {
      code,
      client_id: OAUTH.GOOGLE_OAUTH_CLIENT_ID,
      client_secret: OAUTH.GOOGLE_OAUTH_CLIENT_SECRET,
      redirect_uri,
      grant_type: 'authorization_code',
    };
    try {
      const {data} = await axios.post<GoogleOauthToken>(
        rootURl,
        qs.stringify(options),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return data;
    } catch (err: any) {
      console.log('Failed to fetch Google Oauth Tokens :', err);
      throw new Error(err);
    }
  };

  public getGoogleUser = async ({
    id_token,
    access_token,
  }: {
    id_token: string;
    access_token: string;
  }): Promise<GoogleUserResult> => {
    try {
      const {data} = await axios.get<GoogleUserResult>(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
        {
          headers: {
            Authorization: `Bearer ${id_token}`,
          },
        },
      );

      return data;
    } catch (err: any) {
      console.log(err);
      throw Error(err);
    }
  };
}
