/**
 * Represents options for writing to the database.
 */
interface DBWriteOptions<T> {
  /** Indicates whether to hash the UID before writing to the database. */
  hash?: boolean;
  /**
   * A custom comparison function to determine if the current content is different from the previous content in the database.
   * @param curr The current content.
   * @param previous The previous content stored in the database as a string.
   * @returns true if the current content is different from the previous content, false otherwise.
   */
  compare?: (curr: T, previous: string) => boolean;
}

export default DBWriteOptions;
