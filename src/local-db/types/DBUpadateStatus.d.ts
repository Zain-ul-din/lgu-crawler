interface DBUpdateStatus<T> {
  content: T,
  similarity: 'identical' | 'different'
}

