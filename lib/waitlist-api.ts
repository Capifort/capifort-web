import { apiFetch } from './api'

export const joinWaitlist = (email: string): Promise<void> =>
  apiFetch('/api/waitlist', { method: 'POST', body: JSON.stringify({ email }) })
