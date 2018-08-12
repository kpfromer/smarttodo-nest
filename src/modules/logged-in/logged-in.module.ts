import { Module } from '@nestjs/common';
import { LoggedInService } from './logged-in.service';

const servicesViaProviders = [
  { provide: LoggedInService, useValue: LoggedInService }
];

@Module({
  providers: servicesViaProviders,
  exports: servicesViaProviders
})
export class LoggedInModule {}
