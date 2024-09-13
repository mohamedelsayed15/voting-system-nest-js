import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('voter', { schema: 'vs' })
@Index('voter_national_id', ['nationalId'], { unique: true })
export class Voter {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ type: 'varchar', length: 255 })
    firstName: string;

    @Column({ type: 'varchar', length: 255 })
    secondName: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    nationalId: string;

    @Column({ type: 'text' })
    password: string;

    @Column({ type: 'text', nullable: true, default: null })
    token: string | null;
}
