import { fullURL } from "lib/url-fns"

export const descriptor = {
  id: "counterparty-output-descriptor",
  schema: [
    {
      uri: fullURL("/api/schemas/CounterpartyAccountHolder")
    }
  ],
  name: "Counterparty PII Compliance",
  description:
    "Attestation of Counterparty PII used for originators and beneficiaries of transactions that trigger counterparty exchange requirements",
  display: {
    title: {
      text: "Counterparty Compliance"
    },
    subtitle: {
      path: ["$.CounterpartyAccountHolder.legalName"],
      fallback: "Includes legal name"
    },
    description: {
      text: "Describes an attestation of Counterparty PII used for originators and beneficiaries of transactions that trigger counterparty exchange requirements, such as the US Travel Rule and the FATF InterVASP message requirements."
    },
    properties: [
      {
        label: "Legal Name",
        path: ["$.CounterpartyAccountHolder.legalName"],
        schema: { type: "string" }
      },
      {
        label: "Account Number",
        path: ["$.CounterpartyAccountHolder.accountNumber"],
        schema: { type: "string" }
      }
    ]
  }
}
