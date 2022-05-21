import { Bytes } from '@graphprotocol/graph-ts'
import { integer } from '@protofire/subgraph-toolkit'
import { Stat } from '../../generated/schema'
import { LENS_ID } from '../constanst'

export namespace lens {
  export function getOrCreateLensInfo(): Stat {
    let stats = Stat.load(LENS_ID)
    if (stats == null) {
      stats = new Stat(LENS_ID)
      stats.totalAccounts = integer.ZERO
      stats.totalProfiles = integer.ZERO
      stats.totalPosts = integer.ZERO
      stats.totalMirror = integer.ZERO
      stats.totalAccounts = integer.ZERO
      stats.totalPublications = integer.ZERO
      stats.totalComments = integer.ZERO

      stats.save()
    }
    return stats as Stat
  }
}
