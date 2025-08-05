import { startServer } from './server.js';
import { initMongoDB } from './db/initMongoDB.js';
import { createDirIfNotExists } from './utils/createDirIfNot.js';
import { TEM_UNPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';


const bootstrap = async () => {
  await initMongoDB();
  startServer();
  await createDirIfNotExists(TEM_UNPLOAD_DIR);
  await createDirIfNotExists(UPLOAD_DIR);
};

bootstrap();

