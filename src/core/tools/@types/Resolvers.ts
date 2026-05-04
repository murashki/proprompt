export type Resolvers<
  TData extends any = void,
> = {
  promise: Promise<TData>;
  resolve: (data: TData) => void;
  reject: (error: any) => void;
  resolved: boolean;
};
