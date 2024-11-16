import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ethers } from 'ethers'
import {
  Marketplace,
  Marketplace__factory,
} from '../../../../standalone/marketplace-contract/typechain-types'
import { contractAddress } from 'src/common/util'
import { PrismaService } from 'src/common/prisma/prisma.service'

@Injectable()
export class ListenerService implements OnModuleInit, OnModuleDestroy {
  private provider: ethers.WebSocketProvider
  private contract: Marketplace

  constructor(private readonly prisma: PrismaService) {}

  onModuleDestroy() {
    //Remove all subscriptions
    this.cleanup()
  }

  onModuleInit() {
    //Initialize the websocket provider
    this.initializeWebSocketProvider()
    //Setup the event subscriber
    this.subscribeToEvents()
  }

  initializeWebSocketProvider() {
    const infuraWssURL = `wss://polygon-amoy.infura.io/ws/v3/${process.env.INFURA_KEY}`
    this.provider = new ethers.WebSocketProvider(infuraWssURL)

    this.contract = Marketplace__factory.connect(contractAddress, this.provider)
  }

  subscribeToEvents() {
    try {
      this.contract.on(
        this.contract.filters.ItemListed,
        async (
          id,
          name,
          price,
          owner,
          isSold,
          quantity,
          ownerId,
          createdAt,
          purchases,
          event,
        ) => {
          // @ts-expect-error: expected but not certain
          const blockNumber = event.log.blockNumber
          const timestamp = await this.getBlockTimeStamp(blockNumber)

          await this.prisma.item.create({
            data: {
              // @ts-expect-error : no equal types of values

              id,
              name,
              // @ts-expect-error : no equal types of values
              price,
              // @ts-expect-error : no equal types of values
              owner,
              // @ts-expect-error : no equal types of values
              isSold,
              // @ts-expect-error : no equal types of values
              quantity,
              ownerId,
              createdAt,
              purchases,
              timestamp,
            },
          })
        },
      )
    } catch (error) {
      console.log('Error:', error)
    }
  }

  cleanup() {
    this.provider.removeAllListeners()
  }

  async getBlockTimeStamp(blockNumber: number) {
    const block = await this.provider.getBlock(blockNumber)
    return new Date(block.timestamp * 1000)
  }
}
