export abstract class AbstractResponseDTO {
  private readonly status: string;

  public getStatus(): string {
    return this.status;
  }

  constructor(status: string) {
    this.status = status;
  }
}
