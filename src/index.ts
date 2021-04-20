import * as urqlCore from '@urql/core';
import { DocumentNode } from 'graphql';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { OperationContext, OperationResult } from '@urql/core/dist/types/types';
import { from, Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { CombinedError, Operation } from '@urql/core';

interface UrqlRxOperationFunction {
  <
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Data = any,
    // eslint-disable-next-line @typescript-eslint/ban-types
    Variables extends object = {}
  >(
    query: DocumentNode | TypedDocumentNode<Data, Variables> | string,
    variables?: Variables,
    context?: Partial<OperationContext>
  ): Observable<OperationResult<Data, Variables>>;
}

interface RxUseOperationResult<Data = any, Variables = object> {
  fetching: boolean;
  stale: boolean;
  data?: Data;
  error?: CombinedError;
  extensions?: Record<string, any>;
  operation?: Operation<Data, Variables>;
}

interface UrqlRxUseOperationFunction {
  <
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Data = any,
    // eslint-disable-next-line @typescript-eslint/ban-types
    Variables extends object = {}
  >(
    query: DocumentNode | TypedDocumentNode<Data, Variables> | string,
    variables?: Variables,
    context?: Partial<OperationContext>
  ): Observable<RxUseOperationResult<Data, Variables>>;
}

declare module '@urql/core' {
  interface Client {
    rxQuery: UrqlRxOperationFunction;
    rxMutation: UrqlRxOperationFunction;
    rxUseQuery: UrqlRxUseOperationFunction;
    rxUseMutation: UrqlRxUseOperationFunction;
  }
}

function rxQuery<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Data = any,
  // eslint-disable-next-line @typescript-eslint/ban-types
  Variables extends object = {}
>(
  query: DocumentNode | TypedDocumentNode<Data, Variables> | string,
  variables?: Variables,
  context?: Partial<OperationContext>
): Observable<OperationResult<Data, Variables>> {
  return from<Observable<OperationResult<Data, Variables>>>(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.query(query, variables, context).toPromise()
  );
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
urqlCore.Client.prototype.rxQuery = rxQuery;

function rxMutation<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Data = any,
  // eslint-disable-next-line @typescript-eslint/ban-types
  Variables extends object = {}
>(
  query: DocumentNode | TypedDocumentNode<Data, Variables> | string,
  variables?: Variables,
  context?: Partial<OperationContext>
): Observable<OperationResult<Data, Variables>> {
  return from<Observable<OperationResult<Data, Variables>>>(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.mutation(query, variables, context).toPromise()
  );
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
urqlCore.Client.prototype.rxMutation = rxMutation;

function rxUseQuery<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Data = any,
  // eslint-disable-next-line @typescript-eslint/ban-types
  Variables extends object = {}
>(
  query: DocumentNode | TypedDocumentNode<Data, Variables> | string,
  variables?: Variables,
  context?: Partial<OperationContext>
): Observable<RxUseOperationResult<Data, Variables>> {
  return from<Observable<RxUseOperationResult<Data, Variables>>>(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.query(query, variables, context)
      .toPromise()
      .then((result: OperationResult<Data, Variables>) => ({
        fetching: false,
        ...result,
        stale: !!result.stale,
      }))
  ).pipe(startWith({ fetching: true, stale: false }));
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
urqlCore.Client.prototype.rxUseQuery = rxUseQuery;

function rxUseMutation<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Data = any,
  // eslint-disable-next-line @typescript-eslint/ban-types
  Variables extends object = {}
>(
  query: DocumentNode | TypedDocumentNode<Data, Variables> | string,
  variables?: Variables,
  context?: Partial<OperationContext>
): Observable<RxUseOperationResult<Data, Variables>> {
  return from<Observable<RxUseOperationResult<Data, Variables>>>(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.mutation(query, variables, context)
      .toPromise()
      .then((result: OperationResult<Data, Variables>) => ({
        fetching: false,
        ...result,
        stale: !!result.stale,
      }))
  ).pipe(startWith({ fetching: true, stale: false }));
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
urqlCore.Client.prototype.rxUseMutation = rxUseMutation;

export * from '@urql/core';
