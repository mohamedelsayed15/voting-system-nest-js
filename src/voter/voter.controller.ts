import { Body, ConflictException, Controller, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { VoterService } from './voter.service';
import { VoterDto } from './dto/createVoter.dto';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AdminOnlyGuard } from 'src/guards/adminOnly.guard';

@Controller('voter')
export class VoterController {

    constructor(
        private voterService: VoterService,
        private authService: AuthService
    ) { }


    @UseGuards(JwtAuthGuard, AdminOnlyGuard)
    @Post("admin/createVoter")
    async createVoter(@Body(new ValidationPipe()) body: VoterDto) {

        const nationalId = body.nationalId
        const password = body.password

        const voterExist = await this.voterService.findVoterByNationalId(nationalId)

        if (voterExist) {
            throw new ConflictException("voter already exists")
        }

        const hashPassword = await this.authService.hashPassword(password)

        const voter = await this.voterService.createVoter({
            firstName: body.firstName,
            secondName: body.secondName,
            nationalId: nationalId,
            password: hashPassword
        })

        return voter
    }
}
