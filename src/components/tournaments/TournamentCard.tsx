import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Users, DollarSign, Trophy } from 'lucide-react'
import { Tournament } from '@/types/tournament'

interface TournamentCardProps {
  tournament: Tournament
  onJoin: (tournamentId: string) => void
  onView: (tournamentId: string) => void
  isRegistered?: boolean
}

export function TournamentCard({ tournament, onJoin, onView, isRegistered = false }: TournamentCardProps) {
  const getStatusColor = (status: Tournament['status']) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800'
      case 'registration':
        return 'bg-green-100 text-green-800'
      case 'ongoing':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const canRegister = tournament.status === 'registration' && 
                     tournament.registeredPlayers < tournament.maxPlayers && 
                     !isRegistered

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
            {tournament.title}
          </CardTitle>
          <Badge className={getStatusColor(tournament.status)}>
            {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
          </Badge>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Trophy className="h-4 w-4" />
          <span>{tournament.game} - {tournament.format}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(tournament.date)} at {tournament.time}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span className="line-clamp-1">{tournament.location}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{tournament.registeredPlayers}/{tournament.maxPlayers} players</span>
          </div>
          
          {tournament.entryFee > 0 && (
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <DollarSign className="h-4 w-4" />
              <span>${tournament.entryFee}</span>
            </div>
          )}
        </div>
        
        {tournament.prizePool && (
          <div className="text-sm text-amber-600 font-medium">
            Prize Pool: {tournament.prizePool}
          </div>
        )}
        
        <p className="text-sm text-gray-600 line-clamp-2">
          {tournament.description}
        </p>
      </CardContent>
      
      <CardFooter className="flex space-x-2 pt-3">
        <Button variant="outline" onClick={() => onView(tournament.id)} className="flex-1">
          View Details
        </Button>
        
        {canRegister && (
          <Button onClick={() => onJoin(tournament.id)} className="flex-1 bg-blue-600 hover:bg-blue-700">
            Register
          </Button>
        )}
        
        {isRegistered && (
          <Button variant="secondary" disabled className="flex-1">
            Registered
          </Button>
        )}
        
        {tournament.status === 'completed' && (
          <Button variant="outline" onClick={() => onView(tournament.id)} className="flex-1">
            View Results
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}