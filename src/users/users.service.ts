import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UsersDocument } from './schema/users.schema';
import { Model } from 'mongoose';
import { sleep } from 'src/sleep';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class UsersService {

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager, //: Cache,
    @InjectModel(User.name) private usersModel: Model<UsersDocument>
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.usersModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    const key = 'users-find-all';
    const usersCached = await this.cacheManager.get(key);

    if (usersCached) {
      return usersCached;
    }

    const users = await this.usersModel.find().exec();

    // await sleep(10000)

    await this.cacheManager.set(key, users);

    return users;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.usersModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  async remove(id: string): Promise<User> {
    const deletionResult = await this.usersModel.deleteOne({ _id: id }).exec();
    if (deletionResult.deletedCount === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return null;
  }
}
