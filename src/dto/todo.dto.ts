import { ArrayNotEmpty, IsArray, IsBoolean, IsString, MinLength, ValidateNested } from 'class-validator';

export class TodoDto {
  @IsString()
  @MinLength(1)
  readonly description: string;

  @IsBoolean()
  readonly completed: string;
}

export class TodosDto {
  @ValidateNested({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  todos: TodoDto[];
}
