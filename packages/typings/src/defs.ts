export type Constructor<Return = any, Args = any> = new (
  ...args: Args[]
) => Return;

export type Decorator = (
  target: Record<string, any>,
  key: string | symbol,
  descriptor: PropertyDescriptor,
) => PropertyDescriptor | void;

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type ObjectAssignFunctionType = (
  target: Record<string, any>,
  source: Record<string, any>,
  key: string,
) => void;

export declare type NestedPathsObjectUntilLeaf<
  Type extends Record<string, any>,
  Depth extends number[],
> = Depth['length'] extends 8
  ? []
  : Type extends Record<string, string>
  ? []
  : Type extends string
  ? []
  : {
      [Key in keyof Type]: Type[Key] extends string
        ? []
        :
            | [Key]
            | [Key, ...NestedPathsObjectUntilLeaf<Type[Key], [...Depth, 1]>];
    }[keyof Type];

export declare type NestedPathsObjectsJustLeaf<
  Type extends Record<string, any>,
  Depth extends number[],
> = Depth['length'] extends 8
  ? []
  : Type extends string
  ? []
  : {
      [Key in keyof Type]: [
        Key,
        ...NestedPathsObjectsJustLeaf<Type[Key], [...Depth, 1]>,
      ];
    }[keyof Type];

export declare type Join<T extends unknown[], D extends string> = T extends []
  ? ''
  : T extends [string | number]
  ? `${T[0]}`
  : T extends [string | number, ...infer R]
  ? `${T[0]}${D}${Join<R, D>}`
  : string;

export declare type NestedPaths<
  Type,
  Depth extends number[],
> = Depth['length'] extends 8
  ? []
  : Type extends
      | string
      | number
      | boolean
      | Date
      | RegExp
      | Buffer
      | Uint8Array
      | ((...args: any[]) => any)
      | {
          _bsontype: string;
        }
  ? []
  : Type extends ReadonlyArray<infer ArrayType>
  ? [] | [number, ...NestedPaths<ArrayType, [...Depth, 1]>]
  : Type extends Map<string, any>
  ? [string]
  : Type extends object
  ? {
      [Key in Extract<keyof Type, string>]: Type[Key] extends Type
        ? [Key]
        : Type extends Type[Key]
        ? [Key]
        : Type[Key] extends ReadonlyArray<infer ArrayType>
        ? Type extends ArrayType
          ? [Key]
          : ArrayType extends Type
          ? [Key]
          : [Key, ...NestedPaths<Type[Key], [...Depth, 1]>] // child is not structured the same as the parent
        : [Key, ...NestedPaths<Type[Key], [...Depth, 1]>] | [Key];
    }[Extract<keyof Type, string>]
  : [];

export type MaybePromise<T> = T | Promise<T>;
