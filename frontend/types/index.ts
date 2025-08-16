export type MemoryType = 'text' | 'image' | 'link' | 'pdf';

export interface Memory {
  id: string;
  type: MemoryType;
  content: string;
  title: string;
  createdAt: Date;
  updatedAt?: Date;
  metadata?: {
    fileName?: string;
    fileSize?: number;
    url?: string;
    imageUri?: string;
  };
}

export interface BaseComponentProps {
  onSave: (memory: Omit<Memory, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}
// 