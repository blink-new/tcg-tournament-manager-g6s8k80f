import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Calendar, MapPin, Users, DollarSign, Trophy } from 'lucide-react'
import { blink } from '@/blink/client'
import toast from 'react-hot-toast'

interface CreateTournamentModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
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

export function CreateTournamentModal({ open, onClose, onSuccess }: CreateTournamentModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    game: '',
    format: '',
    location: '',
    address: '',
    date: '',
    time: '',
    maxPlayers: 16,
    entryFee: 0,
    prizePool: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const user = await blink.auth.me()
      
      const tournament = {
        id: `tournament_${Date.now()}`,
        ...formData,
        status: 'registration' as const,
        organizerId: user.id,
        organizerName: user.displayName || user.email,
        registeredPlayers: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      await blink.db.tournaments.create(tournament)
      
      toast.success('Tournament created successfully!')
      onSuccess()
      onClose()
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        game: '',
        format: '',
        location: '',
        address: '',
        date: '',
        time: '',
        maxPlayers: 16,
        entryFee: 0,
        prizePool: ''
      })
    } catch (error) {
      console.error('Error creating tournament:', error)
      toast.error('Failed to create tournament')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-blue-600" />
            <span>Create New Tournament</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title">Tournament Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter tournament title"
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your tournament..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="game">Game *</Label>
              <Select value={formData.game} onValueChange={(value) => handleInputChange('game', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select game" />
                </SelectTrigger>
                <SelectContent>
                  {GAMES.map((game) => (
                    <SelectItem key={game} value={game}>{game}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="format">Format *</Label>
              <Select value={formData.format} onValueChange={(value) => handleInputChange('format', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  {FORMATS.map((format) => (
                    <SelectItem key={format} value={format}>{format}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">Venue Name *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Game store or venue name"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Full address"
                required
              />
            </div>

            <div>
              <Label htmlFor="date">Date *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="time">Start Time *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="maxPlayers">Max Players *</Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="maxPlayers"
                  type="number"
                  value={formData.maxPlayers}
                  onChange={(e) => handleInputChange('maxPlayers', parseInt(e.target.value))}
                  min="4"
                  max="128"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="entryFee">Entry Fee ($)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="entryFee"
                  type="number"
                  value={formData.entryFee}
                  onChange={(e) => handleInputChange('entryFee', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="prizePool">Prize Pool Description</Label>
              <Input
                id="prizePool"
                value={formData.prizePool}
                onChange={(e) => handleInputChange('prizePool', e.target.value)}
                placeholder="e.g., $100 store credit, booster packs, etc."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? 'Creating...' : 'Create Tournament'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}