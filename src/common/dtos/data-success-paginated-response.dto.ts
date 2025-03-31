import { PaginatedData } from '../types/paginated-data.type';
import { AbstractResponseDTO } from './abstract-response.dto';

export class DataSuccessPaginatedResponseDTO<T> extends AbstractResponseDTO {
  private page: number;
  private size: number;
  private totalCount: number;
  private data: T[];

  public getPage(): number {
    return this.page;
  }

  public setPage(page: number): void {
    this.page = page;
  }

  public getSize(): number {
    return this.size;
  }

  public setSize(size: number): void {
    this.size = size;
  }

  public getTotalCount(): number {
    return this.totalCount;
  }

  public setTotalCount(totalCount: number): void {
    this.totalCount = totalCount;
  }

  public getData(): T[] {
    return this.data;
  }

  public setData(data: T[]): void {
    this.data = data;
  }

  constructor(paginatedData: PaginatedData<T>) {
    super('SUCCESS');

    this.page =
      (paginatedData.skip + paginatedData.limit) / paginatedData.limit;
    this.size = paginatedData.limit;

    this.totalCount = paginatedData.totalCount;

    this.data = paginatedData.data;
  }
}
