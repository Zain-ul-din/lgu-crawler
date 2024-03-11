interface MetaDataType {
  [semester: string]: {
    [program: string]: string[];
  };
}

export default MetaDataType;
