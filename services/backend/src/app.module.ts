import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { AiModule } from './ai/ai.module';
import { DoubtsModule } from './doubts/doubts.module';
import { StudyRoomsModule } from './study-rooms/study-rooms.module';
import { NotesModule } from './notes/notes.module';
import { TeacherModule } from './teacher/teacher.module';
import { SafetyModule } from './safety/safety.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { CoursesModule } from './courses/courses.module';
import { CalendarModule } from './calendar/calendar.module';
import { ReportsModule } from './reports/reports.module';
import { ResourcesModule } from './resources/resources.module';
import { NotificationsModule } from './notifications/notifications.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    AiModule,
    DoubtsModule,
    StudyRoomsModule,
    NotesModule,
    TeacherModule,
    SafetyModule,
    AssignmentsModule,
    CoursesModule,
    CalendarModule,
    ReportsModule,
    ResourcesModule,
    NotificationsModule,
    LeaderboardModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}