import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter, MapPin } from 'lucide-react'

interface TournamentSearchProps {
  onSearch: (filters: SearchFilters) => void
}

export interface SearchFilters {
  query: string
  game: string
  format: string
  status: string
  location: string
}

const GAMES = [
  'Magic: The Gathering',
  'Pokemon TCG',
  'Yu-Gi-Oh!',
  'Flesh and Blood',
  'Digimon Card Game',
  'Dragon Ball Super',
  'One Piece Card Game'
]

const FORMATS = [
  'Standard',
  'Modern',
  'Legacy',
  'Vintage',
  'Commander',
  'Draft',
  'Sealed',
  'Constructed'
]

export function TournamentSearch({ onSearch }: TournamentSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    game: '',
    format: '',
    status: '',
    location: ''
  })

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onSearch(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      query: '',
      game: '',
      format: '',
      status: '',
      location: ''
    }
    setFilters(clearedFilters)
    onSearch(clearedFilters)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center space-x-2 mb-4">
        <Search className="h-5 w-5 text-gray-500" />
        <h2 className="text-lg font-semibold text-gray-900">Find Tournaments</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="xl:col-span-2">
          <Input
            placeholder="Search tournaments..."
            value={filters.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
            className="w-full"
          />
        </div>
        
        <Select value={filters.game} onValueChange={(value) => handleFilterChange('game', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Game" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Games</SelectItem>
            {GAMES.map((game) => (
              <SelectItem key={game} value={game}>{game}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={filters.format} onValueChange={(value) => handleFilterChange('format', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Formats</SelectItem>
            {FORMATS.map((format) => (
              <SelectItem key={format} value={format}>{format}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Status</SelectItem>
            <SelectItem value="registration">Registration Open</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Location"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button variant="outline" onClick={clearFilters} size="sm">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}