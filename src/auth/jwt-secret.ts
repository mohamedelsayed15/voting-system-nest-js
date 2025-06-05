// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const secret = process.env.JWT_SECRET;

export default secret;
