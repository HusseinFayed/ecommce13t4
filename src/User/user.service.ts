import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './user.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { DepositDto } from './deposit.dto';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
    ) { }

    async createUser(user: UserDto) {
        const user_check = await this.userRepository.findOne({ where: { username: user.username } })
        // Check if user already exists
        if (user_check) {
            // User already exists
            throw new HttpException('User Already Exists', HttpStatus.BAD_REQUEST);
        }
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(user.password, saltOrRounds);

        const newUser = await this.userRepository.save({
            username: user.username,
            password: hashedPassword,
            // deposit: user.deposit,
            role: user.role,
        })
        return newUser

    }

    async getUserByEmail(username: string): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { username } });
    }

    async getUserByUserName(username: string): Promise<User> {
        return await this.userRepository.findOne({ where: { username: username } })
    }

    async getUserById(id: number): Promise<User> {
        return await this.userRepository.findOne({ where: { id: id } })
    }

    async deposit(req, userCheck, deposit: DepositDto) {
        const old_deposit = userCheck.deposit
        const new_deposit = +old_deposit + +deposit.deposit
        console.log('old deposit:', old_deposit)
        console.log('new_deposit', new_deposit)
        await this.userRepository.update({ username: req.user.name }, { deposit: new_deposit })
    }
}