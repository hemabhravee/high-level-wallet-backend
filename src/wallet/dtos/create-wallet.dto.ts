import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { MIN_BALANCE } from 'src/common/constants/business.constants';

export class CreateWalletDTO {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => {
    // Skip transformation if undefined or null
    if (value === undefined || value === null) return value;
    // Trim the string if it's a string
    return typeof value === 'string' ? value.trim() : value;
  })
  private name: string;

  @IsOptional()
  @ValidateIf((o) => {
    const shouldValidate = o.balance !== undefined && o.balance !== null;

    return shouldValidate;
  })
  @Transform(({ value }) => {
    // Skip transformation if undefined or null
    if (value === undefined || value === null) return value;
    // Convert to number if it's a string
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    // Round to 4 decimal places
    return Number(numValue.toFixed(4));
  })
  @IsNumber(
    {},
    {
      message: 'balance must be a number',
    },
  )
  @Min(MIN_BALANCE, {
    message: 'balance must be greater than or equal to ' + MIN_BALANCE,
  })
  // @Max(MAX_BALANCE, {
  //   message: 'balance must be less than ' + MAX_BALANCE,
  // })
  private balance?: number;

  // This constructor allows both direct instantiation and NestJS transformation
  constructor(partial?: Partial<CreateWalletDTO>) {
    console.log('Constructor called with:', partial);
    if (partial) {
      Object.assign(this, partial);
      console.log('After Object.assign, this is:', this);
      // Note: The @Transform decorator will handle rounding during validation
    }
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getBalance(): number | undefined {
    return this.balance;
  }

  public setBalance(balance: number): void {
    console.log('setBalance called with:', balance);
    // Round to 4 decimal places when setting the balance
    this.balance =
      balance !== undefined && balance !== null
        ? Number(balance.toFixed(4))
        : undefined;
  }
}
