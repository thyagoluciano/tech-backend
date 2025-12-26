import { prisma } from '@/lib/prisma';

import { IUserRepository } from './i-user-repository';
import { UserSchema } from '../schemas/user-schema';

export class PrismaUserRepository implements IUserRepository {
  async findById(id: string): Promise<UserSchema | null> {
    return await prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<UserSchema | null> {
    return await prisma.user.findUnique({ where: { email } });
  }

  async create(data: UserSchema): Promise<UserSchema> {
    return await prisma.user.create({ 
      data: {
        email: data.email,
        password: data.password
      } 
    });
  }

  async update(id: string, data: Partial<UserSchema>): Promise<UserSchema> {
    return await prisma.user.update({
      where: { id },
      data
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}