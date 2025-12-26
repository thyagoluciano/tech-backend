import { UserSchema } from '../schemas/user-schema';

export interface IUserRepository {
  findById(id: string): Promise<UserSchema | null>;
  findByEmail(email: string): Promise<UserSchema | null>;
  create(data: UserSchema): Promise<UserSchema>;
  update(id: string, data: Partial<UserSchema>): Promise<UserSchema>;
  delete(id: string): Promise<void>;
}