import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Poll } from './poll.entity';

@Entity('pollRivals', { schema: 'vs' })
@Index('poll_rival_poll_pk', ['pollPk'])
export class PollRivals {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column({ type: 'varchar', length: 255 })
    rivalName: string;

    @Column({ type: 'int', default: 0 })
    votersNumber: number;

    @ManyToOne(() => Poll, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'pollPk' })
    pollPk: Poll;
}
