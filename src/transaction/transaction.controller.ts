import { Body, Controller, Post, Get, Param, Query } from '@nestjs/common';
import { RouteConstants } from 'src/common/constants/route.constant';
import { TransactionService } from './transaction.service';
import { CreateTransactionDTO } from './dtos/create-transaction.dto';
import { DataSuccessObjectResponseDTO } from 'src/common/dtos/data-success-object-response.dto';
import { AbstractResponseDTO } from 'src/common/dtos/abstract-response.dto';
import { TransactionFiltersDTO } from './dtos/transaction-filters.dto';
import { DataSuccessPaginatedResponseDTO } from 'src/common/dtos/data-success-paginated-response.dto';
@Controller({
  path: RouteConstants.TRANSACTION.BASE,
})
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async createTransaction(
    @Body() createTransactionDTO: CreateTransactionDTO,
  ): Promise<AbstractResponseDTO> {
    const transaction = await this.transactionService.createTransaction(
      createTransactionDTO,
    );
    return new DataSuccessObjectResponseDTO(transaction);
  }

  @Get('/query')
  async queryTransactions(
    @Query() filtersDTO: TransactionFiltersDTO,
  ): Promise<AbstractResponseDTO> {
    const transactionsPage = await this.transactionService.queryTransactions(
      filtersDTO,
    );
    return new DataSuccessPaginatedResponseDTO(transactionsPage);
  }
}
