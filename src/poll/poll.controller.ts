import { Body, ConflictException, Controller, Get, NotFoundException, Post, Query, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AdminOnlyGuard } from 'src/guards/adminOnly.guard';
import { PollService } from './poll.service';
import { PollDto } from './dto/poll.dto';
import { RivalDto } from './dto/rival.dto';
import { RivalInterface } from './interface/rival.interface';
import { VoterOnlyGuard } from 'src/guards/voterOnly.guard';
import { VoteToDto } from './dto/vote-to.dto';
import { query } from 'express';
import { PageDto } from './dto/page.dto';

@Controller('poll')
export class PollController {
    constructor(
        private pollService: PollService,

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

        const { pollPk, pollName, rivalPk, rivalName } = body

        const user = req.user

        const logExist = await this.pollService.selectFromPollVotersLog(pollPk, user.pk)

        if (logExist) {
            throw new ConflictException("user already voted")
        }
        const count = await this.pollService.updateRivalVotersTotalCount(
            rivalPk,
            pollPk,
            rivalName
        )

        if (count === 0) {
            throw new NotFoundException()
        }
        await this.pollService.updatePollVotersTotalCount(pollPk)


        const log = await this.pollService.insertPollVoter({
            pollPk,
            rivalName,
            rivalPk,
            voterName: user.firstName + user.secondName,
            voterPk: user.pk
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
