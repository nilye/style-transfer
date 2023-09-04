declare global {
  type AnyObject = Record<string, any>;
  type AnyFunction = (...args: any) => any;
  type ValueOf<T> = T[keyof T];
  type Nil = undefined | null;
  type Primitive = string | number | boolean | Nil;
}

export { };

