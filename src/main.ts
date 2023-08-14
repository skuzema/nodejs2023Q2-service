import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CustomExceptionFilter } from './logging/custom-exception.filter';
import { CustomLogger } from './logging/logging.service';

dotenv.config();
const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const loggingService = app.get(CustomLogger);
  app.useLogger(loggingService);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new CustomExceptionFilter(loggingService));

  const config = new DocumentBuilder()
    .setTitle('Home Library Service')
    .addServer(`http://localhost:${PORT}/`)
    .setDescription(
      'Users can create, read, update, delete data about Artists, Tracks and Albums, add them to Favorites in their own Home Library!',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('doc', app, document);

  await app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
}
bootstrap();
