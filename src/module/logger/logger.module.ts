import {Module} from '@nestjs/common';
import {LoggerService} from 'nest-logger';

export function loggerFactory(): LoggerService {
  return new LoggerService(
    'debug',
    [
      LoggerService.console({
        timeFormat: 'HH:mm',
        consoleOptions: {
          level: 'debug'
        }
      }),
      LoggerService.rotate({
        colorize: false,
        fileOptions: {
          dirname: '/var/log/cat-feeder-pi/',
          filename: 'all-%DATE%.log',
          level: 'debug',
          datePattern: 'YYYY-MM'
        }
      })
    ]
  );
}

@Module({
  providers: [
    {
      provide: LoggerService,
      useFactory: loggerFactory
    },
  ],
  exports: [
    LoggerService
  ]
})
export class LoggerModule {}
