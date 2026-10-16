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
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      return product;
    } catch (error: any) {
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    try {
      return await this.productRepository.find();
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(id: string) {
    try {
      return this.productRepository.findOneBy({ id: id})
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    try {
      const product = await this.findOne(id);
      await this.productRepository.delete(id);
      return `This action removes a #${id} product`;
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
}
