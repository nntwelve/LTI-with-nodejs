import { Application } from './configs/app.config.js';
import { lti } from './configs/lti.config.js';

const app = new Application(lti);
app.listen();

export { app };
