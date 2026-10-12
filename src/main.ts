import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');                             //* Colocamos un prefijo global para todas las rutas de la API
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,                                   //* Esto hace que solo se acepten las propiedades que esten en el DTO, si mandan una propiedad que no esta en el DTO, la ignora
      forbidNonWhitelisted: true,                        //* Esto hace que si mandan una propiedad que no esta en el DTO, lance un error
    })
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
