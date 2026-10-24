import { BadRequestException, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers';
import { serialize } from 'v8';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService
  ) {}

  @Get('product/:imageName')
  findProductImage(
    @Param('imageName') imageName: string
  ){

    const path = this.filesService.getStaticProductImage(imageName);
    return path;
  }

  /**
   * Vamos a hacer la carga de archivos por medio en un POST
   * Siempre o la gran mayoria de tiempo esto se hace mediante un petición de
   * tipo POST
   */
  @Post('product')
  @UseInterceptors(FileInterceptor(
    'file', 
    { 
      fileFilter: fileFilter, 
      storage: diskStorage({
        destination: './static/products',
        filename: fileNamer
      })
    }
  ))
  uploadProductIamage(
   @UploadedFile() file: Express.Multer.File
  ){
    if(!file){
      throw new BadRequestException('Make sure that the file is image')
    }

    const secureUrl = `${file.filename}`

    return secureUrl;
  }

}
