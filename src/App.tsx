import { useState, useEffect, useCallback } from 'react'
import { Header } from '@/components/layout/Header'
import { TournamentSearch, SearchFilters } from '@/components/tournaments/TournamentSearch'
import { TournamentCard } from '@/components/tournaments/TournamentCard'
import { CreateTournamentModal } from '@/components/tournaments/CreateTournamentModal'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Trophy, Calendar, Users, MapPin } from 'lucide-react'
import { blink } from '@/blink/client'
import { Tournament } from '@/types/tournament'
import toast from 'react-hot-toast'

function App() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [filteredTournaments, setFilteredTournaments] = useState<Tournament[]>([])
  const [tournamentsLoading, setTournamentsLoading] = useState(true)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [registeredTournaments, setRegisteredTournaments] = useState<string[]>([])

  // Auth state management
  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const loadTournaments = async () => {
    try {
      setTournamentsLoading(true)
      const tournamentsData = await blink.db.tournaments.list({
        orderBy: { createdAt: 'desc' },
        limit: 50
      })
      setTournaments(tournamentsData)
      setFilteredTournaments(tournamentsData)
    } catch (error) {
      console.error('Error loading tournaments:', error)
      // Set empty array instead of showing error for better UX
      setTournaments([])
      setFilteredTournaments([])
    } finally {
      setTournamentsLoading(false)
    }
  }

  const loadUserRegistrations = useCallback(async () => {
    if (!user?.id) return
    try {
      const registrations = await blink.db.players.list({
        where: { userId: user.id }
      })
      setRegisteredTournaments(registrations.map(r => r.tournamentId))
    } catch (error) {
      console.error('Error loading registrations:', error)
      // Set empty array instead of showing error for better UX
      setRegisteredTournaments([])
    }
  }, [user?.id])

  // Load tournaments when user is authenticated
  useEffect(() => {
    if (user) {
      loadTournaments()
      loadUserRegistrations()
    }
  }, [user, loadUserRegistrations])

  const handleSearch = (filters: SearchFilters) => {
    let filtered = tournaments

    if (filters.query) {
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(filters.query.toLowerCase()) ||
        t.description.toLowerCase().includes(filters.query.toLowerCase()) ||
        t.organizerName.toLowerCase().includes(filters.query.toLowerCase())
      )
    }

    if (filters.game) {
      filtered = filtered.filter(t => t.game === filters.game)
    }

    if (filters.format) {
      filtered = filtered.filter(t => t.format === filters.format)
    }

    if (filters.status) {
      filtered = filtered.filter(t => t.status === filters.status)
    }

    if (filters.location) {
      filtered = filtered.filter(t => 
        t.location.toLowerCase().includes(filters.location.toLowerCase()) ||
        t.address.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    setFilteredTournaments(filtered)
  }

  const handleJoinTournament = async (tournamentId: string) => {
    try {
      const tournament = tournaments.find(t => t.id === tournamentId)
      if (!tournament) return

      if (tournament.registeredPlayers >= tournament.maxPlayers) {
        toast.error('Tournament is full')
        return
      }

      // Register player
      await blink.db.players.create({
        id: `player_${Date.now()}`,
        name: user.displayName || user.email,
        email: user.email,
        userId: user.id,
        tournamentId,
        checkedIn: false,
        registeredAt: new Date().toISOString()
      })

      // Update tournament player count
      await blink.db.tournaments.update(tournamentId, {
        registeredPlayers: tournament.registeredPlayers + 1
      })

      toast.success('Successfully registered for tournament!')
      setRegisteredTournaments(prev => [...prev, tournamentId])
      loadTournaments() // Refresh tournaments
    } catch (error) {
      console.error('Error joining tournament:', error)
      toast.error('Database not available. Please try again later.')
    }
  }

  const handleViewTournament = (tournamentId: string) => {
    // TODO: Implement tournament details view
    toast.info('Tournament details view coming soon!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="border-b bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <Trophy className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-semibold text-gray-900">TCG Tournament Manager</span>
              </div>
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onCreateTournament={() => setCreateModalOpen(true)} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find & Host TCG Tournaments
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover local trading card game tournaments or create your own. 
            Connect with players, manage events, and compete in your favorite games.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">{tournaments.length}</p>
                <p className="text-gray-600">Total Tournaments</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">
                  {tournaments.filter(t => t.status === 'registration' || t.status === 'upcoming').length}
                </p>
                <p className="text-gray-600">Upcoming Events</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-amber-600" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">
                  {tournaments.reduce((sum, t) => sum + t.registeredPlayers, 0)}
                </p>
                <p className="text-gray-600">Registered Players</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <TournamentSearch onSearch={handleSearch} />

        {/* Tournaments Grid */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Tournaments ({filteredTournaments.length})
            </h2>
          </div>

          {tournamentsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm border">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-1/3 mb-4" />
                  <Skeleton className="h-16 w-full mb-4" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 flex-1" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredTournaments.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tournaments found</h3>
              <p className="text-gray-600 mb-6">
                {tournaments.length === 0 
                  ? "Be the first to create a tournament in your area!"
                  : "Try adjusting your search filters or create a new tournament."
                }
              </p>
              <Button onClick={() => setCreateModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Trophy className="h-4 w-4 mr-2" />
                Create Tournament
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTournaments.map((tournament) => (
                <TournamentCard
                  key={tournament.id}
                  tournament={tournament}
                  onJoin={handleJoinTournament}
                  onView={handleViewTournament}
                  isRegistered={registeredTournaments.includes(tournament.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <CreateTournamentModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={loadTournaments}
      />
    </div>
  )
}

export default App