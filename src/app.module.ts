import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    /**
     * Configuración de las variables de entorno, esto lo hacemos para poder 
     * usar las variables de entorno en cualquier parte de la aplicacción, y no 
     * tener que estar importando el módulo de configuración en cada módulo que lo
     * necesites.
     */
    ConfigModule.forRoot({}),
    /**
     * Configuración del módulo de TypeORM, para la base de datos, esto lo hacemos
     * para poder usar la base de datos. la configuración de la base de datos 
     * va junto con las variables de entorno
     */
    TypeOrmModule.forRoot({
      type: 'postgres',                           //* Tipo de base de datos que estamos usando
      host: process.env.DB_HOST,                  //* Host de la base de datos
      port: parseInt(`${process.env.DB_PORT}`),   //* Puerto de la base de datos
      database: process.env.DB_NAME,              //* Nombre de la base de datos
      username: process.env.DB_USERNAME,          //* Usuario de la base de datos
      password: process.env.DB_PASSWORD,          //* Contraseña de la base de datos
      autoLoadEntities: true,                     //* Cargar automáticamente las entidades
      synchronize: true,                          //* Sincronizar la base de datos con las entidades
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
