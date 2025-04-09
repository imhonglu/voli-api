import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";
import { FILE_FIELD_NAME } from "../media.constants";
import { UploadedFile } from "../types/uploaded-file.interface";

export class UploadMediaDto {
  @ApiProperty({ type: "string", format: "binary" })
  @IsNotEmpty()
  [FILE_FIELD_NAME]!: UploadedFile;

  @ApiProperty({ type: "number" })
  @IsInt()
  @Transform(({ value }) => Number.parseInt(value, 10))
  userId!: number;
}
