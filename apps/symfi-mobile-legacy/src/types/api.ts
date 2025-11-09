export type ApiError = {
  http_code: number;
  message: string;
  reason: string;
  success: false;
};

export type ApiSuccess<T extends string | undefined> = {
  http_code: number;
  message: string;
  meta: T;
  success: true;
};

export type CollectionFormat<T> = {
  has_more: boolean;
  objects: T[];
  page: number;
};
