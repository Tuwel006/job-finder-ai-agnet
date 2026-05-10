import type { ParsedResume } from '../shared/types.js'

export interface IResumeParser {
  parse(fileBuffer: Buffer, fileName: string): Promise<ParsedResume>
  generateEmbedding(parsedResume: ParsedResume): Promise<number[]>
}