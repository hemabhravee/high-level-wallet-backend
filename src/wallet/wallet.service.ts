import { Injectable, Logger } from '@nestjs/common';
import { WalletRepository } from './wallet.repository';
import { CreateWalletDTO } from './dtos/create-wallet.dto';
import { WalletDocument } from './entities/wallet.entity';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);

  constructor(private readonly walletRepository: WalletRepository) {}

  /**
   * Create a new wallet
   */
  createWallet(createWalletDTO: CreateWalletDTO): Promise<WalletDocument> {
    this.logger.log(
      `Creating new wallet with name: ${createWalletDTO.getName()}`,
    );

    return this.walletRepository.create(createWalletDTO);
  }

  /**
   * Find wallet by ID
   */
  findById(id: string): Promise<WalletDocument> {
    this.logger.log(`Finding wallet with ID: ${id}`);
    return this.walletRepository.findById(id);
  }

  /**
   * Find wallet by name
   */
  findByName(name: string): Promise<WalletDocument> {
    this.logger.log(`Finding wallet with name: ${name}`);
    return this.walletRepository.findByName(name);
  }
}
