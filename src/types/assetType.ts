export interface Asset {
  id: number;
  assetCode: string;
  name: string;
  category: string;
  status: string;
  condition: string;
  location: string;
  assignedTo?: string;
  assigneeId?: string;
  value: number;
  quantity?: number;
  purchaseDate: string;
  warrantyDate: string;
  serialNumber: string;
  brand: string;
  model: string;
  supplier: string;
  description: string;
  thumbnail: string;
  createdBy: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  notes?: string;
}

export type CreateAssetData = Omit<Asset, "id" | "createdAt" | "updatedAt">;

export interface UpdateAssetData extends Partial<Omit<Asset, "createdAt">> {
  id: number;
}
