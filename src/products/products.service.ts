import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductService')    //* Logger para ver en consola los errores que genera el sistema

  constructor(
    //* Patron repository
    @InjectRepository(Product) 
    private readonly productRepository: Repository<Product>,  //* Replace 'Product' with your actual entity name


  ) {}


  async create(createProductDto: CreateProductDto) {
    try {
      if(!createProductDto.slug){
        createProductDto.slug = createProductDto.title.toLocaleLowerCase().replaceAll(' ','_').replaceAll("'",'')
      }else{
        createProductDto.slug = createProductDto.title.toLocaleLowerCase().replaceAll(' ','_').replaceAll("'",'')
      }

      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      return product;
    } catch (error: any) {
      this.handleDBExceptions(error);
    }
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
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
}
