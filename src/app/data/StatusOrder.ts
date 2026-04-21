import { QueueStatus } from "../props/UserData"

export const statusOrder: Record<QueueStatus, number> = {
    "Menunggu": 1,
    "Dipanggil": 2,
    "Sedang Diperiksa": 3,
    "Selesai": 4,
};