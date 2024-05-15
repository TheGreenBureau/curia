const jsonTypeParse = <T>(str: string) => {
  try {
    const data: T = JSON.parse(str);
    return data;
  } catch {
    return undefined;
  }
};

export default jsonTypeParse;
