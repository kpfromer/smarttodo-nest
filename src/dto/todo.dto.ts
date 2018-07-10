import { ArrayNotEmpty, IsArray, IsBoolean, IsString, MinLength, ValidateNested } from 'class-validator';

export class TodoDto {
  @IsString()
  @MinLength(1)
  readonly description: string;

  @IsBoolean()
  readonly completed: boolean;
}

export class TodosDto {
  @ValidateNested({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  todos: TodoDto[];
}