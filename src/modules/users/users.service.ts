import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  create(dto: CreateUserDto): Promise<User> {
    return this.userModel.create(dto);
  }

  async findAll(page = 1, limit = 10, role?: string): Promise<{ data: User[]; total: number }> {
    const query: FilterQuery<UserDocument> = {};
    if (role) query.role = role;
    const [data, total] = await Promise.all([
      this.userModel.find(query).skip((page - 1) * limit).limit(limit).lean(),
      this.userModel.countDocuments(query),
    ]);
    return { data: data as User[], total };
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).lean();
    if (!user) throw new NotFoundException('User not found');
    return user as User;
  }

  findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(id, dto, { new: true }).lean();
    if (!user) throw new NotFoundException('User not found');
    return user as User;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.userModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('User not found');
  }
}
