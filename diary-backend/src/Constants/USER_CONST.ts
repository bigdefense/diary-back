import {UserDto} from '@/dto/users.dto';

export const USER_SIGN_UP_RES = {
  FAIL: {
    msg: '회원가입에 실패했습니다',
    code: 'USI10002',
  },
  SUCCESS: {
    msg: '회원가입에 성공했습니다',
    code: 'USI10001',
  },

  EXIST: (result: UserDto) => {
    return {
      code: 'USD10001',
      msg: '해당 이메일로 가입된 유저가 있습니다',
      result,
    };
  },

  NOT_EXIST: {
    code: 'USD10002',
    msg: '해당 이메일로 가입된 유저가 없습니다',
    result: '',
  },
};

export const USER_SIGN_IN_RES = {
  PW_NOT_MATCH: {
    msg: '입력한 정보가 존재하지 않습니다',
    code: 'USI20002',
  },
  SUCCESS: (accessToken: string, refreshToken: string) => {
    return {
      msg: '로그인에 성공했습니다',
      code: 'USI20001',
      result: {
        accessToken,
        refreshToken,
      },
    };
  },
};
