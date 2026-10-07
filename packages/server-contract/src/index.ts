import type { components, operations } from './schema.gen.ts';

export type { components, operations, paths } from './schema.gen.ts';

type Schemas = components['schemas'];

export type AudioFormat = Schemas['AudioFormat'];
export type MediaTrack = Schemas['MediaTrack'];
export type Problem = Schemas['Problem'];
export type SearchResults = Schemas['SearchResults'];
export type ServerInfo = Schemas['ServerInfo'];
export type Source = Schemas['Source'];

export type OperationId = keyof operations;

type Content<T, Binary> = T extends { content: infer C }
  ? 'application/json' extends keyof C
    ? C['application/json']
    : Binary
  : never;

/** Path parameters of an operation. */
export type OperationPath<Id extends OperationId> = NonNullable<
  operations[Id]['parameters']['path']
>;

/** Query parameters of an operation; an object even when all of them are optional. */
export type OperationQuery<Id extends OperationId> = NonNullable<
  operations[Id]['parameters']['query']
>;

/** JSON request body of an operation, `Binary` for any other media type. */
export type OperationBody<Id extends OperationId, Binary = never> = Content<
  operations[Id]['requestBody'],
  Binary
>;

type Responses<Id extends OperationId> = operations[Id]['responses'];

/**
 * JSON body of the successful response, `Binary` for any other media type, `void` without one
 * (also for `304 Not Modified`).
 */
export type OperationResponse<Id extends OperationId, Binary = never> = Responses<Id>[Extract<
  keyof Responses<Id>,
  200 | 201 | 202 | 204 | 304
>] extends infer R
  ? R extends { content: unknown }
    ? Content<R, Binary>
    : void
  : never;

// `[]` for a missing group, so that the arguments stay positional
type Arg<T> = [NonNullable<T>] extends [never] ? [] : [NonNullable<T>];

// the query DTO may fill in the defaults of the optional parameters (class-transformer initializers)
type QueryArg<T> = [NonNullable<T>] extends [never] ? [] : [Required<NonNullable<T>>];

type ContractArgs<Id extends OperationId, Binary> = [
  ...Arg<operations[Id]['parameters']['path']>,
  ...QueryArg<operations[Id]['parameters']['query']>,
  ...Arg<OperationBody<Id, Binary>>,
];

/**
 * Handlers of the operations `Ids`, for `implements` on a Nest controller: path, query and body in
 * this order (missing groups are skipped), then any Nest-injected parameters (`@Res()`, `@Req()`,
 * …; `never` accepts any type). The query is always an object, as Nest passes one even for an
 * empty query string, and its parameters are required, so that the DTO can default the optional
 * ones; whether a parameter may be left out is up to its validation (`@IsOptional()`).
 * `Binary` stands for the non-JSON bodies, e.g. Nest's `StreamableFile`.
 */
export type ControllerMethods<Ids extends OperationId, Binary = never> = {
  [Id in Ids]: (
    ...args: [...ContractArgs<Id, Binary>, ...never[]]
  ) => Promise<OperationResponse<Id, Binary>>;
};
