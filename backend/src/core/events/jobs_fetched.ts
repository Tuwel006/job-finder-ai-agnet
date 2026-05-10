export interface JobsFetchedEvent {
  searchId: string
  userId: string
  provider: string
  count: number
  timestamp: Date
}