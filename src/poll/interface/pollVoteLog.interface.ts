export class PollVoteLogInterface {
  rivalPk: number;
  rivalName: string;

  voterPk: number;
  voterName: string;

  pollPk: number;

  createdAt?: Date;
}
