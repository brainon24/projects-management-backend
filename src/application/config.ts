import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    mongo: {
      url: process.env.MONGO_URI,
    },
    common: {
      port: process.env.PORT,
      jwt_secret_key: process.env.JWT_SECRET,
    },
    mailer: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASS,
    },
  };
});
