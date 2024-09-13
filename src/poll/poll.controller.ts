import { Body, ConflictException, Controller, Get, NotFoundException, Post, Query, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AdminOnlyGuard } from 'src/guards/adminOnly.guard';
import { PollService } from './poll.service';
import { PollDto } from './dto/poll.dto';
import { RivalInterface } from './interface/rival.interface';
import { VoterOnlyGuard } from 'src/guards/voterOnly.guard';
import { VoteToDto } from './dto/vote-to.dto';
import { SocketGateWay } from 'src/socket/socket.gateway';
import { Repository } from 'typeorm';
import { PollRivals } from 'src/entities/pollRivals.entity';
import { PollVoters } from 'src/entities/pollVoters.entity';

@Controller('poll')
export class PollController {
    constructor(
        private pollService: PollService,
        private socketGateway: SocketGateWay,
        private pollRivalsRepo: Repository<PollRivals>,
        private pollVoterRepo: Repository<PollVoters>

    ) { }

    @UseGuards(JwtAuthGuard, AdminOnlyGuard)
    @Post("admin/createPoll")
    async createVoter(@Body(new ValidationPipe()) body: PollDto) {
        console.log("CONTROLLER")

        const { pollName, rivals } = body
        const poll = await this.pollService.createPoll(pollName, rivals.length)
        const pollPk = poll.pk

        const insertedRivals: RivalInterface[] = []

        for (const rival in rivals) {
            const insertedRival = await this.pollService.addRivalToPoll(rival, pollPk)
            insertedRivals.push(insertedRival)
        }
        poll.rivals = insertedRivals

        return poll
    }

    @UseGuards(JwtAuthGuard, VoterOnlyGuard)
    @Post("voter/vote-to-poll")
    async voteToPoll(@Body(new ValidationPipe()) body: VoteToDto, @Request() req) {

        const { pollName, rivalPk, rivalName } = body

        const user = req.user

        // checking if user already voted
        const logExist = await this.pollService.selectFromPollVotersLog(body.pollPk, user.pk)

        // error 409 Conflict user already voted
        if (logExist) {
            throw new ConflictException("user already voted")
        }
        const count = await this.pollService.updateRivalVotersTotalCount(
            rivalPk,
            body.pollPk,
            rivalName
        )
        //error 404 poll not found
        if (count === 0) {
            throw new NotFoundException("couldn't find poll")
        }
        await this.pollService.updatePollVotersTotalCount(body.pollPk)

        const log = await this.pollService.insertPollVoter({
            pollPk: body.pollPk,
            rivalName,
            rivalPk,
            voterName: user.firstName + user.secondName,
            voterPk: user.pk
        })

        const pollRivals = await this.pollRivalsRepo.find({
            where: {
                pollPk: { pk: body.pollPk }
            }
        })
        // on vote send rivals
        this.socketGateway.emitToRoom(`poll-${body.pollPk}`, {
            pollRivals
        })
        // on vote cast vote to connected users
        this.socketGateway.emitToRoom(`vote-cast`, {
            voterName: user.firstName + user.secondName,
            pollPk: body.pollPk,
            pollName,
            rivalName,
            rivalPk
        })
        return log
    }


    @UseGuards(JwtAuthGuard, VoterOnlyGuard)
    @Get("voter/polls-pagination")
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async paginatePolls(@Query() query: any, @Request() req) {

        const user = req.user
        const page = +query.page

        const offset = (page - 1) * 10;

        const polls = await this.pollService.paginatePollToVoter(user.pk, 10, offset)

        return { polls }
    }


}
