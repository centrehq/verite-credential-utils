import { fullURL } from "lib/url-fns"

export const definition = {
  id: "KYBAMLPresentationDefinition",
  input_descriptors: [
    {
      id: "kybaml_input",
      name: "Proof of KYBP",
      purpose: "Please provide a valid credential from a KYBP/AML issuer",
      schema: [
        {
          uri: fullURL("/api/schemas/KYBPAMLAttestation"),
          required: true
        }
      ],
      constraints: {
        statuses: {
          active: {
            directive: "required"
          }
        },
        is_holder: [
          {
            field_id: ["subjectId"],
            directive: "required"
          }
        ],
        fields: [
          {
            path: [
              "$.credentialSubject.KYBPAMLAttestation.process",
              "$.vc.credentialSubject.KYBPAMLAttestation.process",
              "$.KYBPAMLAttestation.process"
            ],
            purpose: "The KYB/AML Attestation requires the field: 'process'.",
            predicate: "required",
            filter: {
              type: "string"
            }
          },
          {
            path: [
              "$.credentialSubject.KYBPAMLAttestation.approvalDate",
              "$.vc.credentialSubject.KYBPAMLAttestation.approvalDate",
              "$.KYBPAMLAttestation.approvalDate"
            ],
            purpose:
              "The KYC/AML Attestation requires the field: 'approvalDate'.",
            predicate: "required",
            filter: {
              type: "string"
            }
          }
        ]
      }
    }
  ]
}
