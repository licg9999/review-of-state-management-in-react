export interface MyBaseState {}

export type AnyFn = (...args: any) => any;

export type Parameter0<TFn extends AnyFn> = TFn extends (arg0: infer P, ...args: any) => any
  ? P
  : never;

export type ParametersExcept0<TFn extends AnyFn> = TFn extends (arg0: any, ...args: infer P) => any
  ? P
  : never;
