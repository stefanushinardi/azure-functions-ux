import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { StacksController } from './stacks.controller';
import { StacksService20200501 } from './2020-05-01/stacks.service';
import { StacksService20200601 } from './2020-06-01/stacks.service';

@Module({
  imports: [SharedModule],
  controllers: [StacksController],
  providers: [StacksService20200501, StacksService20200601],
})
export class StacksModule {}
