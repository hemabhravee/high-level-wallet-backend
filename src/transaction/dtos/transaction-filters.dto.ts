import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsIn,
  Min,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TransactionFiltersDTO {
  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  private walletId: string; // required

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number) // Ensures proper type conversion from request data
  private skip?: number; // optional

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number) // Ensures proper type conversion from request data
  private limit?: number; // optional

  @IsOptional()
  @IsString()
  private search?: string; // optional

  @IsOptional()
  @IsIn(['date', 'amount'])
  private sortField?: 'date' | 'amount'; // optional

  @IsOptional()
  @IsIn(['asc', 'desc'])
  private sortOrder?: 'asc' | 'desc'; // optional

  // This constructor allows both direct instantiation and NestJS transformation
  constructor(partial?: Partial<TransactionFiltersDTO>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }

  // Getters and Setters
  public getWalletId(): string {
    return this.walletId;
  }

  public setWalletId(walletId: string): void {
    this.walletId = walletId;
  }

  public getSkip(): number | undefined {
    return this.skip;
  }

  public setSkip(skip: number | undefined): void {
    this.skip = skip;
  }

  public getLimit(): number | undefined {
    return this.limit;
  }

  public setLimit(limit: number | undefined): void {
    this.limit = limit;
  }

  public getSearch(): string | undefined {
    return this.search;
  }

  public setSearch(search: string | undefined): void {
    this.search = search;
  }

  public getSortField(): 'date' | 'amount' | undefined {
    return this.sortField;
  }

  public setSortField(sortField: 'date' | 'amount' | undefined): void {
    this.sortField = sortField;
  }

  public getSortOrder(): 'asc' | 'desc' | undefined {
    return this.sortOrder;
  }

  public setSortOrder(sortOrder: 'asc' | 'desc' | undefined): void {
    this.sortOrder = sortOrder;
  }
}
