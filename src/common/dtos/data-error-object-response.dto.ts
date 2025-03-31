import { AbstractResponseDTO } from './abstract-response.dto';

export class DataErrorObjectResponseDTO<T> extends AbstractResponseDTO {
  private data: T;

  public getData(): T {
    return this.data;
  }

  public setData(data: T): void {
    this.data = data;
  }

  constructor(data: T) {
    super('ERROR');
    this.data = data;
  }
}
