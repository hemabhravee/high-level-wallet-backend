import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import { CreateTransactionDTO } from './dtos/create-transaction.dto';
import { TransactionDocument } from './entities/transaction.entity';
import { WalletRepository } from 'src/wallet/wallet.repository';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { TransactionFiltersDTO } from './dtos/transaction-filters.dto';
import { PaginatedData } from 'src/common/types/paginated-data.type';
import { TransactionDTO } from './dtos/transaction.dto';
import { ErrorConstants } from 'src/common/constants/error.constants';
import {
  MAX_BALANCE,
  MIN_BALANCE,
} from 'src/common/constants/business.constants';
import { formatNumberWithCommas } from 'src/common/utils/string.utils';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly walletRepository: WalletRepository,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  /**
   * Create a new transaction
   */
  async createTransaction(
    createTransactionDTO: CreateTransactionDTO,
  ): Promise<TransactionDocument> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      this.logger.log(`Creating new transaction: ${createTransactionDTO}`);
      const wallet = await this.walletRepository.findById(
        createTransactionDTO.getWalletId(),
      );

      this.logger.log(
        `Found wallet: ${wallet._id}, current balance: ${wallet.balance}`,
      );
      console.log(JSON.stringify(wallet, null, 2));

      if (wallet.__v !== createTransactionDTO.getVersion())
        throw new BadRequestException(ErrorConstants.walletVersionMismatch);

      const newBalance = wallet.balance + createTransactionDTO.getAmount();

      console.log('newBalance', newBalance);

      if (newBalance < MIN_BALANCE) {
        throw new BadRequestException(
          `Insufficient balance in wallet ${
            wallet.name
          } for transaction amount: ${createTransactionDTO.getAmount()}`,
        );
      } else if (newBalance > MAX_BALANCE) {
        throw new BadRequestException(
          `Bank balance cannot exceed ${formatNumberWithCommas(MAX_BALANCE)}`,
        );
      }

      // Update the wallet balance
      const updatedWallet = await this.walletRepository.updateBalance(
        wallet._id,
        createTransactionDTO.getVersion(),
        newBalance,
        {
          session,
        },
      );

      if (!updatedWallet)
        throw new BadRequestException(ErrorConstants.walletVersionMismatch);

      this.logger.log(
        `Updated wallet balance for wallet ID: ${wallet._id}, new balance: ${updatedWallet.balance}`,
      );
      createTransactionDTO.setBalance(updatedWallet.balance);

      const transaction = await this.transactionRepository.create(
        createTransactionDTO,
        {
          session,
        },
      );

      await session.commitTransaction();

      return transaction;
    } catch (error) {
      this.logger.error(
        `Error creating transaction: ${error.message}`,
        error.stack,
      );
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async queryTransactions(
    filters: TransactionFiltersDTO,
  ): Promise<PaginatedData<TransactionDTO>> {
    this.logger.log(
      `Querying transactions with filters: ${JSON.stringify(filters)}`,
    );

    const entitiesPage = await this.transactionRepository.query(
      filters.getWalletId(),
      filters.getSkip(),
      filters.getLimit(),
      {
        searchText: filters.getSearch(),
        sortField: filters.getSortField(),
        sortOrder: filters.getSortOrder(),
      },
    );
    // Transform entities to DTOs
    return {
      data: entitiesPage.data.map((entity) => new TransactionDTO(entity)),
      totalCount: entitiesPage.totalCount,
      skip: entitiesPage.skip,
      limit: entitiesPage.limit,
    };
    // return this.transactionRepository.query(
    //   filters.getWalletId(),
    //   filters.getSkip(),
    //   filters.getLimit(),
    //   {
    //     searchText: filters.getSearch(),
    //     sortField: filters.getSortField(),
    //     sortOrder: filters.getSortOrder(),
    //   },
    // );
  }
}
