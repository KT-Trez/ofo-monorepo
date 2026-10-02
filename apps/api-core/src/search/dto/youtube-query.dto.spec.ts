import { type ArgumentMetadata, BadRequestException, ValidationPipe } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { YoutubeQueryDto } from './youtube-query.dto.js';

describe('YoutubeQueryDto', () => {
  const metadata: ArgumentMetadata = {
    data: '',
    metatype: YoutubeQueryDto,
    type: 'query',
  };
  const qMock = 'q-mock';

  it.for([
    {
      description: 'valid q query',
      query: {
        q: qMock,
      },
    },
    {
      description: 'valid duration',
      query: {
        duration: 'under_three_mins',
        q: qMock,
      },
    },
    {
      description: 'valid features',
      query: {
        features: ['hd', 'subtitles'],
        q: qMock,
      },
    },
    {
      description: 'valid prioritize',
      query: {
        prioritize: 'relevance',
        q: qMock,
      },
    },
    {
      description: 'valid uploadDate',
      query: {
        q: qMock,
        uploadDate: 'week',
      },
    },
    {
      description: 'valid all enum values together',
      query: {
        duration: 'three_to_twenty_mins',
        features: ['360', 'hd'],
        prioritize: 'popularity',
        q: qMock,
        uploadDate: 'month',
      },
    },
  ])('should pass for $description', async ({ query }) => {
    // given
    const pipe = new ValidationPipe();

    // then
    await expect(pipe.transform(query, metadata)).resolves.not.toThrow();
  });

  it.for([
    {
      description: 'missing q query',
      query: {},
    },
    {
      description: 'empty q query',
      query: {
        q: '',
      },
    },
    {
      description: 'invalid duration',
      query: {
        duration: 'invalid-duration',
        q: qMock,
      },
    },
    {
      description: 'invalid features',
      query: {
        features: ['invalid-feature'],
        q: qMock,
      },
    },
    {
      description: 'invalid features with a valid entry',
      query: {
        features: ['hd', 'invalid-feature'],
        q: qMock,
      },
    },
    {
      description: 'invalid prioritize',
      query: {
        prioritize: 'invalid-priority',
        q: qMock,
      },
    },
    {
      description: 'invalid uploadDate',
      query: {
        q: qMock,
        uploadDate: 'invalid-upload-date',
      },
    },
  ])('should throw for $description', async ({ query }) => {
    // given
    const pipe = new ValidationPipe();

    // then
    await expect(pipe.transform(query, metadata)).rejects.toBeInstanceOf(BadRequestException);
  });
});
