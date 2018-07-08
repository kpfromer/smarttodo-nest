import { Module } from '@nestjs/common';
import { LoggedInService } from './logged-in.service';

@Module({
  providers: [LoggedInService],
  exports: [LoggedInService]
})
export class LoggedInModule {}

// export const CreateLoggedInService = (service) => ({
//   forFeature: (): DynamicModule => {
//     const providers = [
//       {
//         provide: `LoggedInService`,
//         useValue: service
//       }
//     ];
//     return {
//       module: LoggedInModule,
//       providers,
//       exports: providers
//     };
//   }
// });