import { BadRequestException, Get, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { Repository } from 'typeorm';
import * as bcryt  from 'bcrypt';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ){}




  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true, isActive: true }
    });

    if(!user) 
      throw new BadRequestException('Credentials are not valid (email)');

    if(!bcryt.compareSync(password, user.password)) 
      throw new BadRequestException('Credentials are not valid (password)');

    return {
      ...user,
      token: this.getJwtToken({id: user.id})
    };
  }





  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcryt.hashSync(password, 10)
      });
      await this.userRepository.save(user);
      return {
      ...user,
      token: this.getJwtToken({id: user.id})
    };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }


 

  /**
   * 
   * @param payload 
   * @returns token as string
   */
  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }


  /**
   * Creamos nuestra clase que se encargar de manejar los errores
   * @param error 
   */
  private handleDBErrors(error: any): never{
    if(error.code === '23505') throw new BadRequestException(error.detail);

    console.log(error);

    throw new InternalServerErrorException('Please check server logs');
  }
}
