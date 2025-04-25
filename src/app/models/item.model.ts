export enum Status {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface ItemResponse {
  id: number;
  title: string;
  userId: number;
  description: string;
  status: Status;
  priority: Priority;
}

export interface ItemRequest {
  title: string;
  userId: number;
  description: string;
  status: Status;
  priority: Priority;
}

export interface ItemUpdate {
  id: number;
  title?: string;
  userId?: number;
  description?: string;
  status?: Status;
  priority?: Priority;
}

export interface ItemDetailsResponse {
  id: number;
  description: string;
  status: Status;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
}