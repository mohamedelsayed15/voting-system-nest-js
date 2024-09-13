import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('admin', { schema: 'vs' })
@Index('admin_login_name', ['loginName'], { unique: true })
export class Admin {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ type: 'varchar', length: 255 })
    firstName: string;

    @Column({ type: 'varchar', length: 255 })
    secondName: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    loginName: string;

    @Column({ type: 'text' })
    password: string;

    @Column({ type: 'text', nullable: true, default: null })
    token: string | null;
}
