/**
 * Validamos como queremos que nos manden la informacion 
 * para crear un producto, es decir, que propiedades queremos que nos manden y de que tipo son esas 
 * propiedades.
 */
import { IsString, IsNumber, MinLength, IsPositive, IsOptional, IsInt, IsArray, 
         IsIn } from 'class-validator';

export class CreateProductDto {

    @IsString()
    @MinLength(1)
    title: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @IsString()
    @IsOptional()   
    description?: string;

    @IsString()
    @IsOptional()
    slug?: string;

    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @IsString({ each: true })
    @IsArray()
    sizes: string[];

    @IsIn(['men', 'women', 'kid', 'unisex'])
    gender: string;

    @IsString({ each: true})
    @IsArray()
    @IsOptional()
    tags?: string[]

    @IsString({ each: true})
    @IsArray()
    @IsOptional()
    images?: string[]
}

