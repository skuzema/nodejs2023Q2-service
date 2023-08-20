import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CustomExceptionFilter } from './logging/custom-exception.filter';
import { CustomLogger } from './logging/logging.service';
import * as fs from 'fs/promises';
import * as path from 'path';
import { LOG_DIR } from './resources/constants';

dotenv.config();
const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const fullLogPath = path.resolve(process.cwd(), LOG_DIR);
  await fs.mkdir(fullLogPath, { recursive: true });
  const loggingService = app.get(CustomLogger);
  app.useLogger(loggingService);

  process.on('uncaughtException', (err, origin) => {
    loggingService.error(
      `Caught exception: ${err}. Exception origin: ${origin}.`,
    );
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    loggingService.error(`Unhandled Rejection at promise. ${reason}`);
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new CustomExceptionFilter(loggingService));

  const config = new DocumentBuilder()
    .setTitle('Home Library Service')
    .addServer(`http://localhost:${PORT}/`)
    .setDescription(
      'Users can create, read, update, delete data about Artists, Tracks and Albums, add them to Favorites in their own Home Library!',
    )
    .setVersion('1.0')
    .addTag('Default')
    .addTag('Auth')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'refresh-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('doc', app, document);

  await app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
}
bootstrap();
