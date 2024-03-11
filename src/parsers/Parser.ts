/**
 * Base class for all Parser's
 * @template T parser return type
 */
abstract class Parser<T = any> {
  public abstract parse(rawContent: string, selector?: string): T;
}

export default Parser;
