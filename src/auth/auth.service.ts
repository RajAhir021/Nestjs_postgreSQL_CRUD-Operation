import { Injectable, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(private readonly jwtService: JwtService) {}

  private users = []; // Mock data

  async onModuleInit() {
    await this.initializeUsers();
  }

  async initializeUsers() {
    this.users = [
      {
        id: 1,
        username: 'admin',
        password: await bcrypt.hash('admin123', 10),
      },
    ];
    console.log('Users initialized:', this.users);
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = this.users.find((user) => user.username === username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return { id: user.id, username: user.username };
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
