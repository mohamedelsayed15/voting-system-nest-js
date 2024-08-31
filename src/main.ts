import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { query } from './db/connection';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // Automatically transforms payloads to DTO instances
    whitelist: true, // Strips properties that do not have decorators
    forbidNonWhitelisted: true, // Throws an error if non-whitelisted properties are present
  }));
  console.log(3000)
  try {
    const authService = new AuthService(new JwtService())
    const password = "11111111"
    const hashPassword = await authService.hashPassword(password)
    await query(`INSERT INTO vs.admin("firstName", "secondName", "loginName", "password")
    VALUES($1, $2, $3, $4)
    `, [
      "mohamed",
      "elsayed",
      "mohamed1111",
      hashPassword
    ])
    console.log("admin created")
  } catch (e) {
    if (e.code === "23505") {
      console.log("default admin already is created")
    } else {
      console.log(e.code)
    }
  }

}
bootstrap();
