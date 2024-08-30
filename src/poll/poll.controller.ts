import { Body, Controller, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AdminOnlyGuard } from 'src/guards/adminOnly.guard';
import { PollService } from './poll.service';

@Controller('poll')
export class PollController {
    constructor(
        private pollService: PollService,

    ) { }



    @UseGuards(JwtAuthGuard, AdminOnlyGuard)
    @Post("createPoll")
    async createVoter(@Body(new ValidationPipe()) body) {
        console.log("CONTROLLER")


        return
    }
}
