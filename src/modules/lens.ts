import { Bytes } from '@graphprotocol/graph-ts'
import { integer } from '@protofire/subgraph-toolkit'
import { LensInfo } from '../../generated/schema'
import { LENS_ID } from '../constanst'

export namespace lens {
  export function getOrCreateLensInfo(): LensInfo {
    let lens = LensInfo.load(LENS_ID)
    if (lens == null) {
      lens = new LensInfo(LENS_ID)
      lens.totalAccounts = integer.ZERO
      lens.totalProfiles = integer.ZERO
      lens.totalPosts = integer.ZERO
      lens.totalMirror = integer.ZERO
      lens.totalAccounts = integer.ZERO
      lens.totalPublications = integer.ZERO
      lens.totalComments = integer.ZERO
      lens.totalFollowers = integer.ZERO

      lens.save()
    }
    return lens as LensInfo
  }
}
