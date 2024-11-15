import { ethers } from 'ethers'
import { contractAddress } from './util'
import { SimpleCounter__factory } from '../../standalone/simple-counter/typechain-types'
require('dotenv').config()

const main = () => {
  const infuraWsURL = `wss://polygon-amoy.infura.io/ws/v3/${process.env.INFURA_KEY}`

  const provider = new ethers.WebSocketProvider(infuraWsURL)

  const contract = SimpleCounter__factory.connect(contractAddress, provider)

  try {
    contract.on(contract.filters['NumberIncremented'], (updatedNumber) => {
      console.log('Number Incremented', updatedNumber)
    })

    console.log('Number Incrementing Listening...')
  } catch (error) {
    console.error('Event Listener setup failed!!', error)
  }

  try {
    contract.on(contract.filters['NumberDecremented'], (updatedNumber) => {
      console.log('Number Decremented', updatedNumber)
    })

    console.log('Number Decrementing Listening...')
  } catch (error) {
    console.error('Event Listener setup failed!!', error)
  }
}

main()
