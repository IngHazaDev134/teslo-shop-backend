import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { FilesService } from './files.service';
import { fileFilter } from './helpers/fileFilter.helper';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService
  ) {}

  /**
   * Vamos a hacer la carga de archivos por medio en un POST
   * Siempre o la gran mayoria de tiempo esto se hace mediante un petición de
   * tipo POST
   */
  @Post('product')
  @UseInterceptors(FileInterceptor('file', { fileFilter: fileFilter }))
  uploadProductIamage(
   @UploadedFile() file: Express.Multer.File
  ){
    if(!file){
      throw new BadRequestException('Make sure that the file is image')
    }

    return {
      fileName: file.originalname
    };
  }

}
