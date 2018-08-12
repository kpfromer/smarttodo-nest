import { IsBoolean, IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class TodoDto {
  @IsString()
  @MinLength(1)
  readonly description: string;

  @IsBoolean()
  readonly completed: boolean;

  @IsOptional()
  @IsInt()
  readonly position?: number;
}