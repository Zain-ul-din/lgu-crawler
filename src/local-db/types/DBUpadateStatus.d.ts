interface DBUpdateStatus<T> {
  content: T,
  similarity: 'identical' | 'different'
}

export default DBUpdateStatus;
