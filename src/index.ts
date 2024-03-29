import express from 'express';
import usersRouter from './routes/users.routes';
// import YAML from 'yaml';
// import fs from 'fs';
// import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import databaseService from './databases/database.service';
import { defaultErrorHandler } from './middlewares/error.middleware';
import accountRouter from './routes/accounts.routes';
import projectRouter from './routes/projects.routes';
import subdivisionRouter from './routes/subdivisions.routes';
import villaRouter from './routes/villas.routes';
import cors from 'cors';
import utilitiesRouter from './routes/utilities.routes';
import timeSharesRouter from './routes/time_shares.routes';
import { config } from 'dotenv';
import ordersRouter from './routes/orders.routes';
import { initFolder } from './utils/files';
import staticRouter from './routes/static.routes';

config();
// const file = fs.readFileSync(path.resolve('the-oasis-luxury-api.yaml'), 'utf8');
// const swaggerDocument = YAML.parse(file);
const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'OaSis Luxury API',
      version: '1.0.0',
      description: 'The OaSis Luxury API'
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      security: [
        {
          BearerAuth: []
        }
      ]
    }
  },
  apis: ['./openapi/*.yaml']
};
const openapiSpecification = swaggerJSDoc(options);
initFolder();
const app = express();
app.use(
  cors({
    origin: '*' // chỉ cho phép các domain khác nhau truy cập
  })
);
app.use(express.json());
const port = process.env.PORT;
//kết nối database
databaseService.connect();
app.get('/', (req, res) => {
  res.send('Welcome to OaSis Luxury API');
});
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/accounts', accountRouter);
app.use('/api/v1/projects', projectRouter);
app.use('/api/v1/subdivisions', subdivisionRouter);
app.use('/api/v1/villas', villaRouter);
app.use('/api/v1/timeshares', timeSharesRouter);
app.use('/api/v1/utilities', utilitiesRouter);
app.use('/api/v1/orders', ordersRouter);
app.use('/api/v1/static', staticRouter);

app.use('/api-documents', swaggerUi.serve, swaggerUi.setup(openapiSpecification));
app.use(defaultErrorHandler);
app.listen(port, () => {
  console.log(`The OaSis Luxury này đang chạy swagger trên http://localhost:${port}/api-documents`);
});
