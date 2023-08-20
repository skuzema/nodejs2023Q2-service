import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './decorators/public.decorator';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
@ApiTags('Default')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(@Res() res: Response): void {
    res.type('text/plain');
    res.send(this.appService.getHello());
  }
}
