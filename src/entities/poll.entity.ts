import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('poll', { schema: 'vs' })
export class Poll {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ type: 'varchar', length: 255 })
    pollName: string;

    @Column({ type: 'int', default: 0 })
    pollTotalVoters: number;

    @Column({ type: 'int' })
    pollTotalRivals: number;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
