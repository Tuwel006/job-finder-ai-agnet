export interface AgentResult {
  success: boolean
  data?: unknown
  error?: string
}

export interface IAgent {
  run(input: unknown): Promise<AgentResult>
  validate(input: unknown): Promise<boolean>
}