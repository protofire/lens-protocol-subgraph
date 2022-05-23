import { BigInt, Bytes } from '@graphprotocol/graph-ts'
import { ZERO_ADDRESS, integer } from '@protofire/subgraph-toolkit'
import { Account } from '../../generated/schema'
import { lens } from './lens'
import { profiles } from '../modules'

export namespace accounts {
  export function getOrCreateAccount(accountAddress: Bytes): Account {
    let accountId = accountAddress.toHexString()

    let account = Account.load(accountId)
    if (account == null) {
      account = new Account(accountId)
      account.address = accountAddress
      account.totalFollowings = integer.ZERO
      account.following = new Array<string>()
      //account.save()

      // +1 amount of lens profiles
      let lensInfo = lens.getOrCreateLensInfo()
      lensInfo.totalAccounts = lensInfo.totalAccounts.plus(integer.ONE)
      lensInfo.save()
    }
    return account as Account
  }

  // OLD ONE
  /* export function addFollowedProfile(accountAddress: Bytes, profilesNumberList: string[], timestamp: BigInt): void {
    let account = getOrCreateAccount(accountAddress)
    let newFollowing: string[] = account.following

    for (let i = 0; i < profilesNumberList.length; i = i + 1) {
      newFollowing.push(profilesNumberList[i])

      //Add one follower to the profile
      let profile = profiles.getOrCreateProfile(BigInt.fromString(profilesNumberList[i]), timestamp)
      profile.totalFollowers = profile.totalFollowers.plus(integer.ONE)
      profile.save()
    }

    account.following = newFollowing
    account.save()
  } */
}
