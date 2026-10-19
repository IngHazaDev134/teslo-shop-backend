/**
 * La anologia que se haee con la entity es que asi se vera nuestro producto en la base de datos,
 * es como tener una tabla de productos en la base de datos, y cada producto sera un registro en 
 * esa tabla, y cada propiedad de la entity sera una columna en esa tabla.+
 */

import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { ProductImage } from "./product-image.entity";


@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;


    @Column('text', {
        unique: true,
    })
    title: string;

    @Column('float', {
        default: 0
    })
    price: number;

    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @Column('text', {
        unique: true
    })
    slug: string;

    @Column('int', {
        default: 0
    })
    stock: number;

    @Column('text', {
        array: true,
        default: []
    })
    sizes: string[];

    @Column('text')
    gender: string;

    @Column('text', { array: true, default: [] })
    tags: string[];

    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        {cascade: true}
    )
    images?: ProductImage


    @BeforeInsert()
    checkSlugInsert() {
     if(!this.slug){
        this.slug = this.title
     }
     this.slug = this.slug.toLocaleLowerCase().replaceAll(' ','_').replaceAll("'",'')
    }

    @BeforeUpdate()
    checkSlugUpdate(){
        this.slug = this.slug.toLocaleLowerCase().replaceAll(' ','_').replaceAll("'",'')
    }
}
