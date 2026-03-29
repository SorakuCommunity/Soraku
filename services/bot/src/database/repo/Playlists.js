import { Database } from '#structures/classes/Database'
import { randomUUID } from 'crypto'

const LIMIT = 20, TRACKS_LIMIT = 50, NAME_MAX = 100

export class Playlists extends Database {
  constructor() { super() }

  async createPlaylist(userId, name, description = null) {
    const all = await this.findAll('playlists', { user_id: userId })
    if (all.length >= LIMIT) throw new Error(`Max ${LIMIT} playlists per user`)
    if (name.length > NAME_MAX) throw new Error(`Name max ${NAME_MAX} chars`)
    const exists = all.find(p => p.name.toLowerCase() === name.toLowerCase())
    if (exists) throw new Error(`Playlist "${name}" already exists`)
    return this.upsert('playlists', {
      id: randomUUID(), user_id: userId, name, description,
      tracks: [], total_duration: 0, track_count: 0,
    }, 'id')
  }

  async deletePlaylist(playlistId, userId) {
    await this.destroy('playlists', { id: playlistId, user_id: userId })
  }

  async getPlaylist(playlistId) { return this.findOne('playlists', { id: playlistId }) }

  async getUserPlaylists(userId) {
    const { data } = await this.sb.bot().from('playlists').select('*').eq('user_id', userId).order('created_at', { ascending: false })
    return data ?? []
  }

  async getPlaylistByName(userId, name) {
    const { data } = await this.sb.bot().from('playlists').select('*').eq('user_id', userId).ilike('name', name).maybeSingle()
    return data
  }

  async addTrack(playlistId, userId, track) {
    const pl = await this.getPlaylist(playlistId)
    if (!pl || pl.user_id !== userId) throw new Error('Playlist not found')
    const tracks = pl.tracks ?? []
    if (tracks.length >= TRACKS_LIMIT) throw new Error(`Max ${TRACKS_LIMIT} tracks`)
    tracks.push(track)
    const total_duration = tracks.reduce((a, t) => a + (t.duration ?? 0), 0)
    await this.update('playlists', { tracks: tracks, track_count: tracks.length, total_duration, updated_at: new Date().toISOString() }, { id: playlistId })
    return { ...pl, tracks, track_count: tracks.length }
  }

  async removeTrack(playlistId, userId, index) {
    const pl = await this.getPlaylist(playlistId)
    if (!pl || pl.user_id !== userId) throw new Error('Playlist not found')
    const tracks = pl.tracks ?? []
    if (index < 0 || index >= tracks.length) throw new Error('Invalid index')
    tracks.splice(index, 1)
    const total_duration = tracks.reduce((a, t) => a + (t.duration ?? 0), 0)
    await this.update('playlists', { tracks: tracks, track_count: tracks.length, total_duration, updated_at: new Date().toISOString() }, { id: playlistId })
    return { ...pl, tracks }
  }

  async getTracks(playlistId) {
    const pl = await this.getPlaylist(playlistId)
    if (!pl) return []
    return Array.isArray(pl.tracks) ? pl.tracks : []
  }

  async updatePlaylistInfo(playlistId, userId, updates) {
    const allowed = ['name', 'description']
    const data = {}
    for (const k of allowed) if (updates[k] !== undefined) data[k] = updates[k]
    data.updated_at = new Date().toISOString()
    await this.update('playlists', data, { id: playlistId, user_id: userId })
  }

  async getPlaylistCount(userId) {
    const { count } = await this.sb.bot().from('playlists').select('*', { count: 'exact', head: true }).eq('user_id', userId)
    return count ?? 0
  }
}
