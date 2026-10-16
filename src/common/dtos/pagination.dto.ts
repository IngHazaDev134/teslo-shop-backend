/**
 * Creamos nuestro DTO para extraer los parametros de la paginacion que 
 * tendra nuestro endPoint acordemos que los dto no trasforman la data
 */

import { IsOptional, IsPositive } from "class-validator";

export class PaginationDto {

    @IsOptional()
    @IsPositive()
    limit?: number;

    @IsOptional()
    @IsPositive()
    offset?: number;

}