import { Module } from '@nestjs/common';
import { DoubtsService } from './doubts.service';
import { DoubtsController } from './doubts.controller';
import { AiModule } from '../ai/ai.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [AiModule, PrismaModule],
  controllers: [DoubtsController],
  providers: [DoubtsService],
})
export class DoubtsModule {}