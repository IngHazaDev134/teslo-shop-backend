import { Controller, Post, UploadedFile, UseInterceptors, Module } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  /**
   * Vamos a hacer la carga de archivos pormedio en un POST
   * Siempre o la gran mayoria de tiempo esto se hace mediante un petición de
   * tipo POST
   */
  @Post('product')
  @UseInterceptors(FileInterceptor)
  uploadProductIamage(
   file: Express.Multer.File
  ){
    return '';
  }

}
