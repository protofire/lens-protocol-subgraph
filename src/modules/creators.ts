import { BigInt, Bytes } from '@graphprotocol/graph-ts'
import { ZERO_ADDRESS, integer } from '@protofire/subgraph-toolkit'
import { Creator } from '../../generated/schema'
import { lens } from './lens'

export namespace creators {
  export function getOrCreateCreator(accountAddress: Bytes, timeStamp: BigInt): Creator {
    let creatorId = accountAddress.toHexString()

    let creator = Creator.load(creatorId)
    if (creator == null) {
      creator = new Creator(creatorId)
      creator.address = accountAddress
      creator.isWhitelisted = false
      creator.lastUpdated = timeStamp
      creator.save()
    }
    return creator as Creator
  }
}
