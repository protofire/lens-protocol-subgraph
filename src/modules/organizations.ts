import { BigInt, Bytes } from '@graphprotocol/graph-ts'
import { Organization } from '../../generated/schema'
export namespace organizations {
  export function getOrCreateOrganization(
    organizationAddress: Bytes,
    organizationName: string,
    timestamp: BigInt,
  ): Organization {
    let organizationId = organizationAddress.toHexString()
    let organization = Organization.load(organizationId)

    if (organization == null) {
      organization = new Organization(organizationId)
      organization.name = organizationName
      organization.jobs = new Array<string>()
      organization.createdAt = timestamp
    }
    return organization as Organization
  }
}
