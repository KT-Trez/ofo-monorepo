import { Transform, Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import type { OperationQuery, Source } from '@ofo/server-contract';
import { MEDIA_SOURCES } from '../../../config/constants.ts';
import { SOURCE_VALIDATION_OPTIONS } from './common.ts';

type SearchQuery = OperationQuery<'searchMedia'>;

export class SearchMediaQuery implements SearchQuery {
  private static readonly DEFAULT_SEARCH_LIMIT = 20;
  private static readonly MAX_SEARCH_LIMIT = 50;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(SearchMediaQuery.MAX_SEARCH_LIMIT)
  limit = SearchMediaQuery.DEFAULT_SEARCH_LIMIT;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  q!: string;

  @IsOptional()
  @IsIn(MEDIA_SOURCES, SOURCE_VALIDATION_OPTIONS)
  source?: Source;
}
