import { BigInt, Bytes } from '@graphprotocol/graph-ts'
import { ZERO_ADDRESS, integer } from '@protofire/subgraph-toolkit'
import { FollowNFTTransferred } from '../../generated/schema'
import { lens } from './lens'

export namespace transfersNFT {
  export function getOrCreateTransfersNFT(transferId: string): FollowNFTTransferred {
    let nft = FollowNFTTransferred.load(transferId)
    if (nft == null) {
      nft = new FollowNFTTransferred(transferId)
      nft.save()
    }
    return nft as FollowNFTTransferred
  }
}
