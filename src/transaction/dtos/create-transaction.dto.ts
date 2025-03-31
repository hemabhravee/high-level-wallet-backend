import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';

// Custom decorator to validate the minimum absolute value
export function MinAbsoluteValue(
  minValue: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'minAbsoluteValue',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [minValue],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [minValue] = args.constraints;
          return typeof value === 'number' && Math.abs(value) >= minValue;
        },
        defaultMessage(args: ValidationArguments) {
          const [minValue] = args.constraints;
          return `The absolute value of ${args.property} must be at least ${minValue}`;
        },
      },
    });
  };
}

export class CreateTransactionDTO {
  @IsString()
  @IsNotEmpty()
  private walletId: string;

  @Min(0)
  @IsNumber()
  private version: number;

  @MinAbsoluteValue(0.0001, {
    message: 'Transaction amount must be at least 0.0001 in absolute value',
  })
  @Transform(({ value }) => {
    // Skip transformation if undefined or null
    if (value === undefined || value === null) return value;
    // Convert to number if it's a string
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    // Round to 4 decimal places
    return Number(numValue.toFixed(4));
  })
  private amount: number;

  @IsString()
  @Transform(({ value }) => {
    // Skip transformation if undefined or null
    if (value === undefined || value === null) return value;
    // Trim the string if it's a string
    return typeof value === 'string' ? value.trim() : value;
  })
  private description: string;
  private balance: number;

  // Getters and Setters
  public getWalletId(): string {
    return this.walletId;
  }

  public setWalletId(walletId: string): void {
    this.walletId = walletId;
  }

  public getAmount(): number {
    return this.amount;
  }

  public setAmount(amount: number): void {
    this.amount = amount;
  }

  public getDescription(): string {
    return this.description;
  }

  public setDescription(description: string): void {
    this.description = description;
  }

  public getBalance(): number {
    return this.balance;
  }

  public setBalance(balance: number): void {
    this.balance = balance;
  }

  public getVersion(): number {
    return this.version;
  }

  public setVersion(version: number): void {
    this.version = version;
  }

  // This constructor allows both direct instantiation and NestJS transformation
  constructor(partial?: Partial<CreateTransactionDTO>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
