import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ClientSession, Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { DbConstants } from 'src/common/constants/db.constants';
import { CreateTransactionDTO } from './dtos/create-transaction.dto';
import { TransactionDocument } from './entities/transaction.entity';
import { PaginatedData } from 'src/common/types/paginated-data.type';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectModel(DbConstants.transaction)
    private readonly transactionEntity: Model<TransactionDocument>,
  ) {}

  private readonly logger = new Logger(TransactionRepository.name);

  /**
   * Create a new transaction
   */
  async create(
    createTransactionDTO: CreateTransactionDTO,
    options?: { session?: ClientSession },
  ): Promise<TransactionDocument> {
    this.logger.log(
      `Attempting to save transaction :: ${createTransactionDTO}`,
    );

    if (options?.session) {
      return this.transactionEntity
        .create(
          [
            {
              ...createTransactionDTO,
              walletId: new Types.ObjectId(createTransactionDTO.getWalletId()),
            },
          ],
          { session: options.session },
        )
        .then((docs) => docs[0]);
    }

    return this.transactionEntity.create({
      ...createTransactionDTO,
    });
  }

  /**
   * Find transaction by ID
   */
  async findById(id: string): Promise<TransactionDocument> {
    this.logger.log(`Attempting to find transaction with ID :: ${id}`);

    // Validate that the ID is a valid MongoDB ObjectID
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid transaction ID format: ${id}`);
    }

    const transaction = await this.transactionEntity.findById(id).exec();

    if (!transaction) {
      throw new NotFoundException(`Wallet with ID ${id} not found`);
    }

    return transaction;
  }

  async query(
    walletId: string,
    skip: number,
    limit: number,
    options?: {
      searchText?: string; // searches on description, amount, and balance
      sortField?: 'date' | 'amount';
      sortOrder?: 'asc' | 'desc';
    },
  ): Promise<PaginatedData<TransactionDocument>> {
    // Build the base query condition
    const queryCondition: any = { walletId: new Types.ObjectId(walletId) };

    // Add search functionality if searchText is provided
    if (options?.searchText) {
      const searchRegex = new RegExp(options.searchText, 'i');
      const amountSearch = !isNaN(parseFloat(options.searchText))
        ? parseFloat(options.searchText)
        : null;

      queryCondition.$or = [{ description: searchRegex }];

      // Add numeric search if the searchText can be parsed as a number
      if (amountSearch !== null) {
        queryCondition.$or.push(
          // Match exact amount
          { amount: amountSearch },
          // Match negative amount
          { amount: -amountSearch },
          // Match exact balance
          { balance: amountSearch },
        );
      }
    }

    // Build sort configuration
    const sortConfig: any = {};

    if (options?.sortField) {
      const sortKey =
        options.sortField === 'date' ? 'createdAt' : options.sortField;
      sortConfig[sortKey] = options.sortOrder === 'desc' ? -1 : 1;
    } else {
      // Default sort by createdAt descending if no sort specified
      sortConfig.createdAt = -1;
    }

    // Execute the count query for total count
    const totalCount = await this.transactionEntity.countDocuments(
      queryCondition,
    );

    // Execute the main query with pagination and sorting
    const transactions = await this.transactionEntity
      .find(queryCondition)
      .sort(sortConfig)
      .skip(skip)
      .limit(limit)
      .exec();

    return {
      data: transactions,
      totalCount,
      skip,
      limit,
    } as PaginatedData<TransactionDocument>;
  }
}
