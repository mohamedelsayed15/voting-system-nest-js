import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Payload } from './interface/payload.interface';
import { query } from 'src/db/connection';

type Role = "admin" | "voter"
@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) { }



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
                console.log(payload)
                const token = await this.jwtService.sign(payload)
                resolve(token)
            } catch (e) {
                console.log(e)
                reject(new InternalServerErrorException())
            }
        })
    }

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }
    async comparePasswords(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }
}
