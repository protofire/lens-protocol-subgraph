import { ADDRESS_ZERO, integer, ZERO_ADDRESS } from '@protofire/subgraph-toolkit'
import { BigInt, Bytes, log } from '@graphprotocol/graph-ts'
import {
  ProfileCreated,
  FollowNFTURISet,
  ProfileImageURISet,
  FollowModuleSet,
  DispatcherSet,
  ProfileCreatorWhitelisted,
  PostCreated,
  MirrorCreated,
  CommentCreated,
  Followed,
  DefaultProfileSet,
  FollowNFTTransferred,
} from '../../generated/LensHub/LensHub'
import { accounts, profiles, creators, publicactions, follows, transfersNFT } from '../modules'
import { Account } from '../../generated/schema'

export function handleProfileCreated(event: ProfileCreated): void {
  let profile = profiles.getOrCreateProfile(event.params.profileId, event.params.timestamp)
  let creator = accounts.getOrCreateAccount(event.params.creator)
  let to = accounts.getOrCreateAccount(event.params.to)

  profile.creator = event.params.creator.toHexString()
  profile.owner = event.params.to.toHexString()
  profile.followNFTURI = event.params.followNFTURI
  profile.followModule = event.params.followModule
  profile.handle = event.params.handle
  profile.followModuleReturnData = event.params.followModuleReturnData
  profile.imageURI = event.params.imageURI
  profile.lastUpdated = event.block.timestamp

  creator.save()
  to.save()
  profile.save()
}

export function handleFollowNFTURISet(event: FollowNFTURISet): void {
  let profile = profiles.getOrCreateProfile(event.params.profileId, event.block.timestamp)

  profile.followNFTURI = event.params.followNFTURI
  profile.save()
}

export function handleProfileImageURISet(event: ProfileImageURISet): void {
  let profile = profiles.getOrCreateProfile(event.params.profileId, event.block.timestamp)

  profile.imageURI = event.params.imageURI
  profile.save()
}

export function handleFollowModuleSet(event: FollowModuleSet): void {
  let profile = profiles.getOrCreateProfile(event.params.profileId, event.block.timestamp)

  profile.followModule = event.params.followModule
  profile.followModuleReturnData = event.params.followModuleReturnData
  profile.save()
}

export function handleDispatcherSet(event: DispatcherSet): void {
  let profile = profiles.getOrCreateProfile(event.params.profileId, event.block.timestamp)
  profile.dispatcher = event.params.dispatcher
  profile.save()
}

export function handleProfileCreatorWhitelisted(event: ProfileCreatorWhitelisted): void {
  let creator = creators.getOrCreateCreator(event.params.profileCreator, event.params.timestamp)
  creator.isWhitelisted = event.params.whitelisted
  creator.lastUpdated = event.params.timestamp
  creator.save()
}

export function handlePostCreated(event: PostCreated): void {
  let post = publicactions.getOrCreatePost(event.params.profileId, event.params.pubId)
  post.fromProfile = event.params.profileId.toString()
  post.pubId = event.params.pubId
  post.referenceModule = event.params.referenceModule
  post.referenceModuleReturnData = event.params.referenceModuleReturnData
  post.timestamp = event.params.timestamp
  post.contentURI = event.params.contentURI
  post.collectModule = event.params.collectModule
  post.collectModuleReturnData = event.params.collectModuleReturnData

  post.save()
}

export function handleMirrorCreated(event: MirrorCreated): void {
  let mirror = publicactions.getOrCreateMirror(event.params.profileId, event.params.pubId)
  mirror.fromProfile = event.params.profileId.toString()
  mirror.pubId = event.params.pubId
  mirror.referenceModule = event.params.referenceModule
  mirror.referenceModuleReturnData = event.params.referenceModuleReturnData
  mirror.timestamp = event.params.timestamp
  mirror.profileIdPointed = event.params.profileIdPointed
  mirror.pubIdPointed = event.params.pubIdPointed

  mirror.save()
}

export function handleCommentCreated(event: CommentCreated): void {
  let comment = publicactions.getOrCreateComment(event.params.profileId, event.params.pubId)
  comment.fromProfile = event.params.profileId.toString()
  comment.pubId = event.params.pubId
  comment.referenceModule = event.params.referenceModule
  comment.referenceModuleReturnData = event.params.referenceModuleReturnData
  comment.timestamp = event.params.timestamp
  comment.contentURI = event.params.contentURI
  comment.profileIdPointed = event.params.profileIdPointed
  comment.pubIdPointed = event.params.pubIdPointed
  comment.collectModule = event.params.collectModule
  comment.collectModuleReturnData = event.params.collectModuleReturnData

  comment.save()
}

export function handleFollowed(event: Followed): void {
  let newFollows: string[] = []
  newFollows = event.params.profileIds.map<string>((profileId: BigInt): string => profileId.toString())

  // Remove to build it in transfer NFT event
  //accounts.addFollowedProfile(event.params.follower, newFollows, event.params.timestamp)

  let follow = follows.getOrCreateFollow(
    event.params.follower
      .toHexString()
      .concat('-')
      .concat(event.transaction.hash.toHex()),
  )

  follow.fromAccount = event.params.follower.toHexString()
  follow.fromProfileSTR = event.params.follower.toHexString()
  follow.toProfile = newFollows
  follow.timestamp = event.params.timestamp
  follow.save()
}

export function handleDefaultProfileSet(event: DefaultProfileSet): void {
  let account = accounts.getOrCreateAccount(event.params.wallet)
  account.defaultProfile = event.params.profileId.toString()
  account.save()
}

export function handleFollowNFTTransferred(event: FollowNFTTransferred): void {
  let transferId: string = event.params.profileId
    .toString()
    .concat('-')
    .concat(event.transaction.hash.toHex())
  let from = event.params.from.toHexString()
  let to = event.params.to.toHexString()
  let profile = profiles.getOrCreateProfile(event.params.profileId, event.block.timestamp)

  if (from == ZERO_ADDRESS) {
    // MINT FOLLOW NFT
    let toAccount = accounts.getOrCreateAccount(event.params.to)

    //add and count the follower to the profile and the fromAccount
    profile.totalFollowers = profile.totalFollowers.plus(integer.ONE)
    let newFollowers = profile.followers

    if (newFollowers != null) {
      newFollowers.push(toAccount.id)
      profile.followers = newFollowers
    }

    let newFollowing = toAccount.following
    if (newFollowing != null) {
      newFollowing.push(profile.id)
      toAccount.following = newFollowing
    }
    toAccount.totalFollowings = toAccount.totalFollowings.plus(integer.ONE)

    toAccount.save()
  } else if (to == ZERO_ADDRESS) {
    // BURN FOLLOW NFT
    let fromAccount = accounts.getOrCreateAccount(event.params.from)
    profile.totalFollowers = profile.totalFollowers.minus(integer.ONE)

    //minus and count the follower to the profile and the fromAccount
    let newFollowing = fromAccount.following
    const index = newFollowing.indexOf(profile.id)
    if (index > -1) newFollowing.splice(index, 1)
    fromAccount.following = newFollowing
    fromAccount.totalFollowings = fromAccount.totalFollowings.minus(integer.ONE)
  }
  profile.save()

  let nft = transfersNFT.getOrCreateTransfersNFT(transferId)
  nft.from = event.params.from
  nft.to = event.params.to
  nft.timestamp = event.params.timestamp
  nft.followNFTID = event.params.followNFTId
  nft.profileId = event.params.profileId
  nft.save()
}
