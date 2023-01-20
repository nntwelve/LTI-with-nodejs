import dotenv from 'dotenv';
dotenv.config();
import bodyParser from 'body-parser';

export class Application {
  constructor(lti) {
    this.lti = lti;

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  initializeErrorHandling() {}

  initializeMiddlewares() {
    this.lti.app.use(bodyParser.json());
  }

  initializeRoutes() {
    this.lti.app.get('/ping', async (_req, res) => {
      res.send({
        message: 'pong',
      });
    });
  }

  listen() {
    this.lti.setUpPlatform();
  }
}
