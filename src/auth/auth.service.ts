import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Payload } from './interface/payload.interface';
import { query } from 'src/db/connection';
import { JwtValidateReturn } from './interface/jwtValidateReturn';

type Role = "admin" | "voter"
@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) { }

    async validateToken(token: string) {
        try {
            const payload = await this.jwtService.verify(token)
            return payload

        } catch (e) {
            console.log(e)
            return
        }
    }


    async setTokenOnUser(pk: number, token: string, role: Role): Promise<number> {
        const setTokenQuery = `
        UPDATE vs."${role}"
        SET token = $1 
        WHERE pk = $2
        `
        try {
            const result = await query(setTokenQuery, [token, pk])
            return result.rowCount
        } catch (e) {
            console.log(e)
            return e
        }

    }


    async loginToken(user: Payload, role: Role): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const payload: Payload = {
                firstName: user.firstName,
                secondName: user.secondName,
                pk: user.pk,
                role
            }
            try {
                const token = await this.jwtService.sign(payload)
                resolve(token)
            } catch (e) {
                console.log(e)
                reject(new InternalServerErrorException())
            }
        })
    }

    async hashPassword(password: string): Promise<string> {
        try {
            return await bcrypt.hash(password, 10);
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }
    async comparePasswords(password: string, hash: string): Promise<boolean> {
        try {
            return await bcrypt.compare(password, hash);
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }
}
