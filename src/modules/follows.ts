import { BigInt, Bytes } from '@graphprotocol/graph-ts'
import { ZERO_ADDRESS, integer } from '@protofire/subgraph-toolkit'
import { Follow } from '../../generated/schema'
import { lens } from './lens'

export namespace follows {
  export function getOrCreateFollow(accountAddress: string): Follow {
    let follow = Follow.load(accountAddress)
    if (follow == null) {
      follow = new Follow(accountAddress)
    }
    return follow as Follow
  }
}
