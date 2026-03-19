export const getPrefix = (kodeRuangan: string) => {
    switch (kodeRuangan) {
        case "cluster1":
            return "R1";
        case "cluster2":
            return "R2";
        case "cluster3":
            return "R3";
        case "cluster4":
            return "R4";
        default:
            return "RX";
    }
};

export const formatNomorDisplay = (
    kodeRuangan: string,
    nomorAntrean: number,
) => {
    const prefix = getPrefix(kodeRuangan);
    return `${prefix}-${nomorAntrean.toString().padStart(3, "0")}`;
};
