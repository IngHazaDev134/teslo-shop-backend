import { Product } from "src/products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

/**
 * La entidad es como que tengamos una tabla en la base de datos
 */
@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {unique: true})
    email: string;

    @Column('text', { select: false })
    password: string;

    @Column('text')
    fullName: string;

    @Column('bool', {default: true})
    isActive: boolean;

    @Column('text', { array: true, default: ['user']})
    roles: string[];


    @OneToMany(
        () => Product,
        (product) => product.user
    )
    products: Product[];

    //* Son como triggers que se ejecutan antes de insertar o actualizar un registro en la base de datos
    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }
}
