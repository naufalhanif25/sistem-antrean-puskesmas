export const getPrefix = (kodeRuangan: string) => {
  switch (kodeRuangan) {
    case "cluster1":
      return "A";
    case "cluster2":
      return "B";
    case "cluster3":
      return "C";
    case "cluster4":
      return "D";
    default:
      return "X";
  }
};

export const formatNomorDisplay = (
  kodeRuangan: string,
  nomorAntrean: number
) => {
  const prefix = getPrefix(kodeRuangan);
  return `${prefix}-${nomorAntrean.toString().padStart(3, "0")}`;
};