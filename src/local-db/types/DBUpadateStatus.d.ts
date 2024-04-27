/**
 * Represents the status of a database update operation.
 */
interface DBUpdateStatus<T> {
  /** The content that was updated in the database. */
  content: T;
  /** Indicates whether the updated content is identical or different from the previous content in the database. */
  similarity: "identical" | "different";
}

export default DBUpdateStatus;
