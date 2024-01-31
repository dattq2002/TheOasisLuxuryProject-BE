import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import { TokenPayload } from '~/models/requests/user.request';

config();
//hàm này dc viết cho server sử dụng
export const signToken = ({
  payload,
  privateKey,
  options = { algorithm: 'HS256' }
}: {
  payload: string | object | Buffer;
  privateKey: string;
  options?: jwt.SignOptions;
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (err, token) => {
      if (err) reject(err);
      resolve(token as string);
    });
  });
};

export const verifyToken = ({ token, secretOrPublicKey }: { token: string; secretOrPublicKey: string }) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, (err, decoded) => {
      if (err) throw reject(err);
      resolve(decoded as TokenPayload);
    });
  });
};
