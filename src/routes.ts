import { Routes } from 'nest-router';
import { RegisterModule } from './modules/register/register.module';

export const ROUTES: Routes = [
  {
    path: '/v1',
    children: [
      {
        path: '/register',
        module: RegisterModule
      }
    ]
  }
];
