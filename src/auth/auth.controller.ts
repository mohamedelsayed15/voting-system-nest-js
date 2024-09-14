import { Body, Controller, NotFoundException, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AdminService } from 'src/admin/admin.service';
import { VoterService } from 'src/voter/voter.service';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,
        private adminService: AdminService,
        private voterService: VoterService
    ) { }

    @Post("login")
    async login(@Body(new ValidationPipe()) body: LoginDto) {
        let role = body.role

        let user
        if (role === "admin") {
            user = await this.adminService.findAdminByLoginName(body.loginText)
        } else {
            user = await this.voterService.findVoterByNationalId(body.loginText)
        }

        if (!user) {
            throw new NotFoundException('no user')
        }

        const comparedPasswords = await this.authService.comparePasswords(
            body.password,
            user.password)

        if (!comparedPasswords) {
            throw new NotFoundException('no user')
        }

        const token = await this.authService.loginToken(user, role)

        await this.authService.setTokenOnUser(user.pk, token, role)//

        user.token = token
        user.password = ""

        return user
    }
}
