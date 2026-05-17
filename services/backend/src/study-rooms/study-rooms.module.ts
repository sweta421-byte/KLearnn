import { Module } from '@nestjs/common';
import { StudyRoomsService } from './study-rooms.service';
import { StudyRoomsController } from './study-rooms.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StudyRoomsController],
  providers: [StudyRoomsService],
})
export class StudyRoomsModule {}