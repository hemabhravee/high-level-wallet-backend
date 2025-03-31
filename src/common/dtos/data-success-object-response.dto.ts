import { AbstractResponseDTO } from './abstract-response.dto';

export class DataSuccessObjectResponseDTO<T> extends AbstractResponseDTO {
  private data: T;

  public getData(): T {
    return this.data;
  }

  public setData(data: T): void {
    this.data = data;
  }

  constructor(data: T) {
    super('SUCCESS');
    this.data = data;
  }
}
