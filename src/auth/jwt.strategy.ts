import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Payload } from "./interface/payload.interface";

import secret from "./jwt-secret";
import { AdminService } from "src/admin/admin.service";
import { VoterService } from "src/voter/voter.service";
import { JwtValidateReturn } from "./interface/jwtValidateReturn";



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        private adminService: AdminService,
        private voterService: VoterService
    ) {

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: secret,
            ignoreExpiration: false,
            passReqToCallback: true
        });


    }

    async validate(req, payload: Payload) {
        console.log("JWT")

        const token = req.header('Authorization').substring(7)

        const user: JwtValidateReturn = payload
        user.token = token


        return user
    }
}