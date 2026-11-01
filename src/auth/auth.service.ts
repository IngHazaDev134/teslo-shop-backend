import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import * as bcryt  from 'bcrypt';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true }
    });

    if(!user) 
      throw new BadRequestException('Credentials are not valid (email)');

    if(!bcryt.compareSync(password, user.password)) 
      throw new BadRequestException('Credentials are not valid (password)');

    return user;
    // TODO: Retornar el JWT de acceso
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcryt.hashSync(password, 10)
      });
      await this.userRepository.save(user);
      return {...userData};
      // TODO: Retornar el JWT de acceso
    } catch (error) {
      this.handleDBErrors(error);
    }
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
