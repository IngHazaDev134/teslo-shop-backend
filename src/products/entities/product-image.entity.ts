/**
 * Vamos a crear nuestra entidad para el manejo de las imagenes de los 
 * productos
 */

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProductImage {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    url: string
}