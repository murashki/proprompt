export type Resolvers<
  TData extends any = void,
> = {
  promise: Promise<TData>;
  resolve: (data: TData) => void;
  reject: (error: any) => void;
  resolved: boolean;
};

export function withResolvers<
  TData extends any = void,
>(): Resolvers<TData> {
  let resolve: (data: TData) => void = () => null;
  let reject: (error: any) => void = () => null;
  const promise = new Promise<TData>((res, rej) => {
    resolve = (data) => {
      resolvers.resolved = true;
      return res(data);
    };
    reject = (data) => {
      resolvers.resolved = true;
      return rej(data);
    };
  });

  const resolvers = {
    promise,
    resolve,
    reject,
    resolved: false,
  };

  return resolvers;
}
