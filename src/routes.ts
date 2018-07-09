import { Routes } from 'nest-router';
import { LoginModule } from './modules/login/login.module';
import { RegisterModule } from './modules/register/register.module';
import { TodoModule } from './modules/todo/todo.module';

export const ROUTES: Routes = [
  {
    path: '/v1',
    children: [
      {
        path: '/login',
        module: LoginModule
      },
      {
        path: '/register',
        module: RegisterModule
      }
    ]
  }
];
