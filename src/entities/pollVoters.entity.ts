import { Entity, Column, CreateDateColumn, ManyToOne, JoinColumn, Index, PrimaryGeneratedColumn } from 'typeorm';
import { PollRivals } from './pollRivals.entity';
import { Voter } from './voter.entity';
import { Poll } from './poll.entity';

@Entity('pollVoters', { schema: 'vs' })
@Index('poll_voters_rival_pk', ['rivalPk'])
@Index('poll_voters_voter_pk', ['voterPk'])
@Index('poll_voters_poll_pk', ['pollPk'])
export class PollVoters {

    @PrimaryGeneratedColumn()
    pk: number;

    @ManyToOne(() => PollRivals, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'rivalPk' })
    rivalPk: PollRivals;

    @Column({ type: 'varchar', length: 255 })
    rivalName: string;

    @Column({ type: 'varchar', length: 255 })
    voterName: string;

    @ManyToOne(() => Voter)
    @JoinColumn({ name: 'voterPk' })
    voterPk: Voter;

    @ManyToOne(() => Poll, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'pollPk' })
    pollPk: Poll ;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
