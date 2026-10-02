import { ClientPlatform, type ClientPlatforms } from '@ofo/types/app-config';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { IsSemver } from './is-semver.validator.js';

export class AppConfigQueryDto {
  public static readonly CLIENT_PLATFORMS = Object.values(ClientPlatform);

  @IsNotEmpty()
  @IsString()
  @IsSemver()
  appVersion!: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(AppConfigQueryDto.CLIENT_PLATFORMS)
  platform!: ClientPlatforms;
}
