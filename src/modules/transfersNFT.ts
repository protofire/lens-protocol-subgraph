import { FollowNFTTransferred } from '../../generated/schema'

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
