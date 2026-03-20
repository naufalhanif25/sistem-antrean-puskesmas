export type QueueStatus = "Dipanggil" | "Menunggu" | "Sedang Diperiksa" | "Selesai";
export type PasswordInput = "text" | "password";
export type UserRole = "DOKTER" | "ADMIN" | "LAYAR";

export interface UserData {
    cluster: number;
    name: string;
    nip: string;
    role: UserRole;
};

export const statusOrder: Record<QueueStatus, number> = {
    "Sedang Diperiksa": 1,
    "Dipanggil": 2,
    "Menunggu": 3,
    "Selesai": 4,
};