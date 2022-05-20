import { ADDRESS_ZERO, integer } from '@protofire/subgraph-toolkit'
import { BigInt, Bytes } from '@graphprotocol/graph-ts'
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
} from '../../generated/LensHub/LensHub'
import { accounts, profiles, creators, publicactions, follows } from '../modules'

export function handleProfileCreated(event: ProfileCreated): void {
  let profile = profiles.getOrCreateProfile(event.params.profileId, event.params.timestamp)
  accounts.getOrCreateAccount(event.params.creator)
  accounts.getOrCreateAccount(event.params.to)

  profile.creator = event.params.creator.toHex()
  profile.owner = event.params.to.toHex()
  profile.followNFTURI = event.params.followNFTURI
  profile.followModule = event.params.followModule
  profile.handle = event.params.handle
  profile.followModuleReturnData = event.params.followModuleReturnData
  profile.imageURI = event.params.imageURI
  profile.lastUpdated = event.block.timestamp

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
  let follow = follows.getOrCreateFollow(
    event.params.follower
      .toHexString()
      .concat('-')
      .concat(event.transaction.hash.toHexString()),
  )

  follow.fromProfile = event.params.follower.toHexString()
  let newFollows: string[] = []
  newFollows = event.params.profileIds.map<string>((profileId: BigInt): string => profileId.toString())
  follow.toProfile = newFollows
  follow.fromProfileAddress = event.params.follower.toHexString()
  follow.timestamp = event.params.timestamp
  follow.save()
}
