import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
    imports: [TypeOrmModule.forFeature([User]),
    // TypeOrmModule.forFeature([Category])
],
    providers: [UserService],
    controllers: [UsersController],
    exports:[UserService]
  })
  export class UserModule {}