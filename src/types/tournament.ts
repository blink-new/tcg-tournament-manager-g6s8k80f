export interface Tournament {
  id: string
  title: string
  description: string
  game: string
  format: string
  location: string
  address: string
  date: string
  time: string
  maxPlayers: number
  entryFee: number
  prizePool: string
  status: 'upcoming' | 'registration' | 'ongoing' | 'completed'
  organizerId: string
  organizerName: string
  registeredPlayers: number
  createdAt: string
  updatedAt: string
}

export interface Player {
  id: string
  name: string
  email: string
  userId: string
  tournamentId: string
  checkedIn: boolean
  registeredAt: string
}

export interface Round {
  id: string
  tournamentId: string
  roundNumber: number
  status: 'pending' | 'active' | 'completed'
  matches: Match[]
  createdAt: string
}

export interface Match {
  id: string
  roundId: string
  player1Id: string
  player2Id: string
  player1Name: string
  player2Name: string
  winnerId?: string
  player1Score?: number
  player2Score?: number
  status: 'pending' | 'active' | 'completed'
  tableNumber?: number
}

export interface User {
  id: string
  email: string
  displayName?: string
  createdAt: string
}