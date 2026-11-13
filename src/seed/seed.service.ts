
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}
  
  async runSeed(){
    await this.deleteTables();
    const adminUser = await this.insertUsers();

    await this.insertNewProducts(adminUser);
    return 'SEED EXECUTED'
  }


  /*
  * vamos a purgar todos los usuarios y productos de la aplicacion y vamos a insertar los productos que tenemos en el archivo seed-data.ts
  * para eso vamos a crear un metodo privado que se encargue de insertar los productos en la base de datos, y vamos a llamar a ese metodo desde el metodo runSeed()
  * y vamos a llamar al metodo deleteAllProduct() del servicio de productos para eliminar todos los productos de la base de datos antes de insertar los nuevos productos
  */
  private async deleteTables() {
    await this.productsService.deleteAllProduct(); 
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().from(User).execute();
  }

  private async insertUsers() {
    const seedUsers = initialData.users;
    const users: User[] = [];

    seedUsers.forEach(user => {
      users.push(this.userRepository.create(user));
    });

    const dbUsers = await this.userRepository.save(seedUsers);
    return dbUsers[0];
  }

  private async insertNewProducts(user: User) {
    await this.productsService.deleteAllProduct();
    const products = initialData.products;
    const insertPromises: Promise<any>[] = [];

    products.forEach(product => {
      insertPromises.push(this.productsService.create(product, user))
    });

    await Promise.all(insertPromises);

    return true;
  }
}
