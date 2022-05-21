import { BigInt, Bytes } from '@graphprotocol/graph-ts'
import { ZERO_ADDRESS, integer } from '@protofire/subgraph-toolkit'
import { Profile } from '../../generated/schema'
import { lens } from './lens'

export namespace profiles {
  export function getOrCreateProfile(profileNumber: BigInt, timeStamp: BigInt): Profile {
    let profileId = profileNumber.toString()

    let profile = Profile.load(profileId)
    if (profile == null) {
      // init profile
      profile = new Profile(profileId)
      profile.profileId = profileNumber
      profile.createdAt = timeStamp
      profile.totalComments = integer.ZERO
      profile.totalPosts = integer.ZERO
      profile.totalMirrors = integer.ZERO
      profile.totalFollowers = integer.ZERO

      // +1 amount of lens profiles
      let lensInfo = lens.getOrCreateLensInfo()
      lensInfo.totalProfiles = lensInfo.totalProfiles.plus(integer.ONE)
      lensInfo.lastProfileCreated = timeStamp
      lensInfo.save()
    }
    return profile as Profile
  }
}
