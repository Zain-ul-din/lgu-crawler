interface DBWriteOptions<T> {
  hash?: boolean;
  compare?: (curr: T, previous: string) => boolean;
}

export default DBWriteOptions;
