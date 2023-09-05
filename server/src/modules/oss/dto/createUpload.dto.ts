import { IsMimeType, IsNotEmpty } from 'class-validator';

export class CreateUploadDto {
  @IsMimeType()
  @IsNotEmpty()
  contentType: string;
}
