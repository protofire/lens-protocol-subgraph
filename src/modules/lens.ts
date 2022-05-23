import { Bytes } from '@graphprotocol/graph-ts'
import { integer } from '@protofire/subgraph-toolkit'
import { Stat } from '../../generated/schema'
import { LENS_ID } from '../constanst'

export namespace stats {
  export function getOrCreateLensInfo(): Stat {
    let statInfo = Stat.load(LENS_ID)
    if (statInfo == null) {
      statInfo = new Stat(LENS_ID)
      statInfo.totalAccounts = integer.ZERO
      statInfo.totalProfiles = integer.ZERO
      statInfo.totalPosts = integer.ZERO
      statInfo.totalMirror = integer.ZERO
      statInfo.totalAccounts = integer.ZERO
      statInfo.totalPublications = integer.ZERO
      statInfo.totalComments = integer.ZERO

      statInfo.save()
    }
    return statInfo as Stat
  }
}
