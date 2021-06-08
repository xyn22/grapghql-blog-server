import { sign, verify } from 'jsonwebtoken';


export async function signToken(payload: string): Promise<string> {
  const secret = process.env.JWT_SECRET;
  return new Promise((resolve, reject) => {
    sign(payload, secret, (err, signed) => err ? reject(err) : resolve(signed));
  });
}

export async function verifyToken(payload: string): Promise<any>  {
  const secret = process.env.JWT_SECRET;
  return new Promise((resolve, reject) => {
    verify(payload, secret, (err, decoded) => err ? reject(err) : resolve(decoded));
  });
}
