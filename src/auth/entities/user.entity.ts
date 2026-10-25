import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

/**
 * La entidad es como que tengamos una tabla en la base de datos
 */
@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {unique: true})
    email: string;

    @Column('text')
    password: string;

    @Column('text')
    fullName: string;

    @Column('bool')
    isActive: boolean;

    @Column('text', { array: true, default: ['user']})
    roles: string[];
}
