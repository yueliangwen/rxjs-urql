import * as urqlCore from '@urql/core';
import { DocumentNode } from 'graphql';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { OperationContext, OperationResult } from '@urql/core/dist/types/types';
import { from, Observable } from 'rxjs';

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

declare module '@urql/core' {
  interface Client {
    rxQuery: UrqlRxOperationFunction;
    rxMutation: UrqlRxOperationFunction;
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

export * from '@urql/core';
