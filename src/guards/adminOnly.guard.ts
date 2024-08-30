import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminOnlyGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        console.log("ADMIN ONLY")
        console.log(req.user)
        if (req.user.role !== "admin") {
            return false
        }
        console.log("ADMIN ONLY")


        return true; // or false if access should be denied
    }
}
