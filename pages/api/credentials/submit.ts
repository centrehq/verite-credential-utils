import {
  buildAndSignFulfillment,
  buildIssuer,
  decodeCredentialApplication,
  decodeVerifiablePresentation
} from "verite"

import { handler } from "lib/api-fns"
import { generateAttestation } from "lib/attestation-fns"
import {
  findCredentialType,
  findCredentialIssuer,
  findCredentialStatus,
  expirationDateForStatus,
  findChainId
} from "lib/credential-fns"
import { apiDebug } from "lib/debug"
import { generateRevocationListStatus } from "lib/revocation-fns"

/**
 * Endpoint for initializing the Credential Exchange.
 *
 * This is the first step in the Credential Exchange process.  It accepts
 * a type, issuer, and status for building out a "manifest" and a credential
 * offer for the client mobile wallet to scan.
 */
const endpoint = handler(async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const type = findCredentialType(req.query.type as string)
  const issuerInfo = findCredentialIssuer(req.query.issuer as string)
  const status = findCredentialStatus(req.query.status as string)
  const chainId =
    type.id === "address" ? findChainId(req.query.chain as string) : undefined

  /**
   * Get signer (issuer)
   *
   * When creating a Verifiable Credential, it is signed with the private key
   * of the issuer.
   */
  const issuer = buildIssuer(
    issuerInfo.did.key,
    Buffer.from(issuerInfo.did.secret, "hex")
  )

  /**
   * Using Presentation Exchange, the client will submit a credential
   * application. Since we are using JWTs to format the data, we first must
   * decode it.
   */
  const application = await decodeCredentialApplication(req.body)

  /**
   * Generate the attestation.
   */
  const attestation = await generateAttestation(type.id, {
    chain: chainId?.type
  })
  apiDebug("Attestation", JSON.stringify(attestation, null, 2))

  // Build a revocation list and index.
  const revocationListStatus = await generateRevocationListStatus(
    issuerInfo,
    status.id === "revoked"
  )

  // Generate the Verifiable Presentation
  const presentation = await buildAndSignFulfillment(
    issuer,
    application,
    attestation,
    {
      credentialStatus: revocationListStatus,
      expirationDate: expirationDateForStatus(status)
    }
  )

  const decoded = await decodeVerifiablePresentation(presentation)
  apiDebug("Presentation", JSON.stringify(decoded, null, 2))

  // Response
  res.status(200).send(presentation)
})

export default endpoint
