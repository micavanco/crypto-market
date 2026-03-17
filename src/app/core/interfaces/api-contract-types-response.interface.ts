interface ContractTypeResponse {
  contractType: number;
  contractSize: number;
}

export interface ApiContractTypesResponse extends Array<ContractTypeResponse> {}
