/**
 * Creamos nuestro DTO para extraer los parametros de la paginacion que 
 * tendra nuestro endPoint acordemos que los dto no trasforman la data
 */
import { Type } from 'class-transformer'
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {

    @IsOptional()
    @Type(() => Number) //* enableImplicitConversions: true
    limit?: number;

    @IsOptional()
    @Min(0)
     @Type(() => Number) //* enableImplicitConversions: true
    offset?: number;

}