import type { IAgent, AgentResult } from '../interfaces/i_agent.js'
import { BaseService } from './base_service.js'

export abstract class BaseAgent extends BaseService implements IAgent {
  abstract run(input: unknown): Promise<AgentResult>

  async validate(_input: unknown): Promise<boolean> {
    return true
  }

  protected success(data: unknown): AgentResult {
    return { success: true, data }
  }

  protected failure(error: string): AgentResult {
    return { success: false, error }
  }
}