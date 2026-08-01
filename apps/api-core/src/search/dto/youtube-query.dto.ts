import { IsArray, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import type { Types } from 'youtubei.js';

const ALLOWED_DURATION: Types.Duration[] = [
  'all',
  'over_twenty_mins',
  'under_three_mins',
  'three_to_twenty_mins',
];

const ALLOWED_FEATURE: Types.Feature[] = [
  '360',
  '3d',
  '4k',
  'creative_commons',
  'hd',
  'hdr',
  'live',
  'location',
  'purchased',
  'subtitles',
  'vr180',
];

const ALLOWED_PRIORITY: Types.Prioritize[] = ['popularity', 'relevance'];

const ALLOWED_UPLOAD_DATE: Types.UploadDate[] = ['all', 'today', 'week', 'month', 'year'];

export class YoutubeQueryDto {
  @IsString()
  @IsIn(ALLOWED_DURATION)
  @IsOptional()
  duration?: Types.Duration;

  @IsArray()
  @IsIn(ALLOWED_FEATURE, { each: true })
  @IsOptional()
  features?: Types.Feature[];

  @IsString()
  @IsIn(ALLOWED_PRIORITY)
  @IsOptional()
  prioritize?: Types.Prioritize;

  @IsString()
  @IsNotEmpty()
  q!: string;

  @IsString()
  @IsIn(ALLOWED_UPLOAD_DATE)
  @IsOptional()
  uploadDate?: Types.UploadDate;
}
