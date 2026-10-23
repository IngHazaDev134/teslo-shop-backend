import { Controller, Post,  UploadedFile } from '@nestjs/common';

import { FilesService } from './files.service';
import { Express } from 'express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  /**
   * Vamos a hacer la carga de archivos pormedio en un POST
   * Siempre o la gran mayoria de tiempo esto se hace mediante un petición de
   * tipo POST
   */
  @Post('product')
  uploadProductIamage(
    file: Express.Multer.File
  ){
    return this.filesService.uploadFile();
  }

}
