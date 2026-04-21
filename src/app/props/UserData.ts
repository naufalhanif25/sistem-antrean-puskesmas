export type QueueStatus = "Dipanggil" | "Menunggu" | "Sedang Diperiksa" | "Selesai";
export type PasswordInput = "text" | "password";
export type UserRole = "DOKTER" | "ADMIN" | "LAYAR";

export interface QueueItem {
    id: number;
    queueNumber: string;
    patientName: string;
    status: QueueStatus;
    cluster: number;
};

export interface UserData {
    cluster: number;
    name: string;
    nip: string;
    role: UserRole;
};