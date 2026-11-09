import { BadRequestException, Injectable, InternalServerErrorException, Logger, 
         NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import { Product, ProductImage } from './entities';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductService')    //* Logger para ver en consola los errores que genera el sistema

  constructor(
    //* Patron repository
    @InjectRepository(Product) 
    private readonly productRepository: Repository<Product>,              //* Replace 'Product' with your actual entity name
    @InjectRepository(ProductImage) 
    private readonly productImageRepository: Repository<ProductImage>,    //* Replace 'ProductImage' with your actual entity name
    //* Inyeccion de la cadena de connexión
    private readonly dataSource: DataSource,

  ) {}


  async create(createProductDto: CreateProductDto, user: User) {
    const { images = [], ...productDetails } = createProductDto;
    try {
      const product = this.productRepository.create({
        ...productDetails, 
        images: images.map(image => this.productImageRepository.create({ url: image })),
        user,
      });
      await this.productRepository.save(product);
      return {...product, images };
    } catch (error: any) {
      this.handleDBExceptions(error);
    }
  }


  async findAll(paginationDto: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = paginationDto;
      const products =  await this.productRepository.find({
        take: limit, skip: offset,
        relations: { images: true }
      });
      return products.map(product => ({
        ...product,
        images: product.images?.map(img => img.url)
      }))
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }



  async findOne(term: string) {
    let product: Product | null;

    try {
      if(isUUID(term)){
        product = await this.productRepository.findOneBy({ id: term });
      }else{
        const queryBullder = this.productRepository.createQueryBuilder('prod');
        product = await queryBullder.where(`UPPER(title) =:title or slug =:slug`, 
          { title: term.toUpperCase(), slug: term.toLocaleLowerCase() })
          .leftJoinAndSelect('prod.images','prodImages')
          .getOne()
      }

      if(!product)
        throw new NotFoundException(`Product with term: ${term} not found`);
      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }


  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    const { images, ...toUpdate } = updateProductDto;

    const product = await this.productRepository.preload({ id, ...toUpdate});

    if(!product)
      throw new NotFoundException(`Product with id: ${id} not found`);

    //* Create query runner para transacciones 
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();                                  //* Nos conectamos a la base de datos para iniciar la transaccion
    await queryRunner.startTransaction();                         //* Inicializamos la transacción

    try {
      if(images){
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        product.images = images?.map(image => this.productImageRepository.create({ url: image }));
      }else{
        //???
        // product.images ???
      }

      product.user = user;
      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOnePlain(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBExceptions(error);
    }
  }



  async remove(id: string) {
    try {
      const product = await this.findOne(id);
      await this.productRepository.delete(id);
      return `Product with id is ${id} has be remove`;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }


  /**
   * Crearemos una clase privada para controlar los errores o dar los mensajes de error que se generan por
   * parte del servidor
   */
  private handleDBExceptions(error: any){
    if(error.code === '23505')
        throw new BadRequestException(error.detail);

      this.logger.error(error)
      throw new InternalServerErrorException('Unexpected error, check server logs');
  }

  /**
   * Creamos un nuevo metodo para aplanar las imagenes al momento de mandar la informacion al frontEnd
   */
  async findOnePlain(term: string) {
    const product = await this.findOne(term);
    return {  
      ...product,
      images: product?.images?.map(image => image.url)
    };
  }


  /**
   * metodo para eliminar todos los productos
   * @returns 
   */
  async deleteAllProduct() {
    const query = this.productRepository.createQueryBuilder('product');
    try {
      return await query.delete().from(Product).execute();
    }catch(error){
      this.handleDBExceptions(error);
    }
  }
}
