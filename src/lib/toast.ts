export type ToastType = "success" | "error";

export type Toast = {
    id: number;
    message: string;
    type: ToastType;
};

let listeners: ((toasts: Toast[]) => void)[] = [];
let toasts: Toast[] = [];

export function subscribe(cb: (toasts: Toast[]) => void) {
    listeners.push(cb);
    cb(toasts);

    return () => {
        listeners = listeners.filter((l) => l !== cb);
    };
}

function notify() {
    listeners.forEach((cb) => cb(toasts));
}

export function showToast(message: string, type: ToastType = "success") {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const newToast = { id, message, type };

    toasts = [...toasts, newToast];
    notify();

    setTimeout(() => {
        removeToast(id);
    }, 3000);
}

export function removeToast(id: number) {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
}
