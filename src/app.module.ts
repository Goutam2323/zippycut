import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import configuration from '@/config/configuration';
import { validateEnv } from '@/config/env.validation';
import { DatabaseModule } from '@/database/database.module';
import { RedisModule } from '@/redis/redis.module';
import { QueueModule } from '@/queue/queue.module';
import { GlobalExceptionFilter } from '@/common/filters/global-exception.filter';
import { PinoMiddleware } from '@/common/middleware/pino.middleware';
import { AuthModule } from '@/modules/auth/auth.module';
import { UsersModule } from '@/modules/users/users.module';
import { BarbersModule } from '@/modules/barbers/barbers.module';
import { ServicesModule } from '@/modules/services/services.module';
import { SlotsModule } from '@/modules/slots/slots.module';
import { BookingsModule } from '@/modules/bookings/bookings.module';
import { PaymentsModule } from '@/modules/payments/payments.module';
import { NotificationsModule } from '@/modules/notifications/notifications.module';
import { AnalyticsModule } from '@/modules/analytics/analytics.module';
import { HealthController } from '@/modules/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration], validate: validateEnv }),
    DatabaseModule,
    RedisModule,
    QueueModule,
    AuthModule,
    UsersModule,
    BarbersModule,
    ServicesModule,
    SlotsModule,
    BookingsModule,
    PaymentsModule,
    NotificationsModule,
    AnalyticsModule,
  ],
  controllers: [HealthController],
  providers: [{ provide: APP_FILTER, useClass: GlobalExceptionFilter }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(PinoMiddleware).forRoutes('*');
  }
}
