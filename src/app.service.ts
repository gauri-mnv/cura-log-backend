import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getTracked(): string {
    return 'clinic client money manager and logger';
  }
}
