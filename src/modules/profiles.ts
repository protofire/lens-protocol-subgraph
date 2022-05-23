import { BigInt, Bytes, log } from '@graphprotocol/graph-ts'
import { ZERO_ADDRESS, integer } from '@protofire/subgraph-toolkit'
import { Profile } from '../../generated/schema'
import { stats } from './lens'

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
      profile.totalFollowings = integer.ZERO
      profile.followers = new Array<string>()
      profile.followings = new Array<string>()

      // +1 amount of lens profiles
      let lensInfo = stats.getOrCreateLensInfo()
      lensInfo.totalProfiles = lensInfo.totalProfiles.plus(integer.ONE)
      lensInfo.lastProfileCreated = timeStamp
      lensInfo.save()
    }
    return profile as Profile
  }

  // le falta porque necesito update del profile tambien del que sigue y del que es seguido
  export function updateProfilesFollowings(
    accountProfiles: Array<string>,
    newFollowing: Array<string>,
    totalFollowings: BigInt,
  ): void {
    for (let i = 0; i < accountProfiles.length; ++i) {
      let profile = getOrCreateProfile(BigInt.fromString(accountProfiles[i]), BigInt.fromI32(0))
      profile.totalFollowings = totalFollowings
      profile.followings = newFollowing
      profile.save()
    }
  }
}
