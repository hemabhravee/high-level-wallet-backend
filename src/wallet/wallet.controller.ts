import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RouteConstants } from 'src/common/constants/route.constant';
import { WalletService } from './wallet.service';
import { CreateWalletDTO } from './dtos/create-wallet.dto';
import { DataSuccessObjectResponseDTO } from 'src/common/dtos/data-success-object-response.dto';
import { AbstractResponseDTO } from 'src/common/dtos/abstract-response.dto';
@Controller({
  path: RouteConstants.WALLET.BASE,
})
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  async createAccount(
    @Body() createWalletDTO: CreateWalletDTO,
  ): Promise<AbstractResponseDTO> {
    const wallet = await this.walletService.createWallet(createWalletDTO);
    return new DataSuccessObjectResponseDTO(wallet);
  }

  @Get('/:id')
  async findWalletById(
    @Param('id') walletId: string,
  ): Promise<AbstractResponseDTO> {
    const wallet = await this.walletService.findById(walletId);
    return new DataSuccessObjectResponseDTO(wallet);
  }

  @Get('/name/:name')
  async findWalletByName(
    @Param('name') walletName: string,
  ): Promise<AbstractResponseDTO> {
    const wallet = await this.walletService.findByName(walletName);
    return new DataSuccessObjectResponseDTO(wallet);
  }
}
