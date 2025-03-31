import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { DbConstants } from 'src/common/constants/db.constants';
import { WalletDocument } from './entities/wallet.entity';
import { CreateWalletDTO } from './dtos/create-wallet.dto';
import { ClientSession } from 'mongoose';

@Injectable()
export class WalletRepository {
  constructor(
    @InjectModel(DbConstants.wallet)
    private readonly walletEntity: Model<WalletDocument>,
  ) {}

  private readonly logger = new Logger(WalletRepository.name);

  /**
   * Create a new wallet
   */
  async create(createWalletDTO: CreateWalletDTO): Promise<WalletDocument> {
    this.logger.log(
      `Attempting to save wallet :: ${createWalletDTO.getName()}`,
    );
    return this.walletEntity.create({
      ...createWalletDTO,
    });
  }

  /**
   * Find wallet by ID
   */
  async findById(id: string): Promise<WalletDocument> {
    this.logger.log(`Attempting to find wallet with ID :: ${id}`);

    // Validate that the ID is a valid MongoDB ObjectID
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid wallet ID format: ${id}`);
    }

    const wallet = await this.walletEntity.findById(id).exec();

    if (!wallet) {
      throw new NotFoundException(`Wallet with ID ${id} not found`);
    }

    return wallet;
  }

  /**
   * Find wallet by name
   */
  async findByName(name: string): Promise<WalletDocument> {
    this.logger.log(`Attempting to find wallet with name :: ${name}`);

    const wallet = await this.walletEntity.findOne({ name }).exec();

    if (!wallet) {
      throw new NotFoundException(`Wallet with name ${name} not found`);
    }

    return wallet;
  }

  updateBalance(
    id: Types.ObjectId | string,
    version: number,
    newBalance: number,
    options?: { session?: ClientSession },
  ): Promise<WalletDocument> {
    this.logger.log(`Attempting to update wallet balance to :: ${newBalance}`);
    return this.walletEntity.findOneAndUpdate(
      { _id: id, __v: version },
      {
        balance: newBalance,
        $inc: { __v: 1 }, // Increment version number
      },
      {
        new: true,
        ...options,
      },
    );
  }
}
