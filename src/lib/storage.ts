export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function createStorage<T>(
  key: string,
  guard: (value: unknown) => value is T,
  adapter: () => StorageAdapter = () => window.localStorage,
) {
  return {
    read(): T | null {
      const raw = adapter().getItem(key);
      if (raw === null) return null;
      const value: unknown = JSON.parse(raw);
      if (!guard(value))
        throw new Error('Dữ liệu đã lưu không hợp lệ. Dữ liệu gốc vẫn được giữ nguyên.');
      return value;
    },
    write(value: T): void {
      adapter().setItem(key, JSON.stringify(value));
    },
  };
}
