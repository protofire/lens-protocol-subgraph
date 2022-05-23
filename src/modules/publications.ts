import { ADDRESS_ZERO, integer } from '@protofire/subgraph-toolkit'
import { BigInt } from '@graphprotocol/graph-ts'
import { Post, Comment, Mirror } from '../../generated/schema'
import { stats } from './lens'

export namespace publicactions {
  export namespace helpers {
    export function getNewPublicactionId(profileId: BigInt, pubId: BigInt): string {
      return profileId
        .toString()
        .concat('-')
        .concat(pubId.toString())
    }
  }

  export function getOrCreatePost(profileId: BigInt, pubId: BigInt): Post {
    let publicationId = helpers.getNewPublicactionId(profileId, pubId)
    let post = Post.load(publicationId)
    if (post == null) {
      post = new Post(publicationId)

      // +1 amount of Post
      let lensInfo = stats.getOrCreateLensInfo()
      lensInfo.totalPosts = lensInfo.totalPosts.plus(integer.ONE)
      lensInfo.totalPublications = lensInfo.totalPublications.plus(integer.ONE)
      lensInfo.save()
    }
    return post as Post
  }

  export function getOrCreateMirror(profileId: BigInt, pubId: BigInt): Mirror {
    let publicationId = helpers.getNewPublicactionId(profileId, pubId)
    let mirror = Mirror.load(publicationId)
    if (mirror == null) {
      mirror = new Mirror(publicationId)

      // +1 amount of Mirror
      let lensInfo = stats.getOrCreateLensInfo()
      lensInfo.totalMirror = lensInfo.totalMirror.plus(integer.ONE)
      lensInfo.totalPublications = lensInfo.totalPublications.plus(integer.ONE)
      lensInfo.save()
    }
    return mirror as Mirror
  }

  export function getOrCreateComment(profileId: BigInt, pubId: BigInt): Comment {
    let publicationId = helpers.getNewPublicactionId(profileId, pubId)
    let comment = Comment.load(publicationId)
    if (comment == null) {
      comment = new Comment(publicationId)

      // +1 amount of Comments
      let lensInfo = stats.getOrCreateLensInfo()
      lensInfo.totalComments = lensInfo.totalComments.plus(integer.ONE)
      lensInfo.totalPublications = lensInfo.totalPublications.plus(integer.ONE)

      lensInfo.save()
    }
    return comment as Comment
  }
}
