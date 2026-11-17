// Put the real recording at src/assets/<file> and it replaces the synthesized sketch.
// seed/base/step/len only shape the placeholder sketch and its waveform.
export type Track = { title: string; sub: string; file: string; seed: number; len: number; base: number; step: number }

export const TRACKS: Record<string, Track> = {
  gymnopedie: { title: 'Gymnopédie No. 1', sub: 'Satie · live in Zürich', file: 'audio/gymnopedie.mp3', seed: 11, len: 20, base: 174.6, step: 0.62 },
  goldberg: { title: 'Goldberg Aria', sub: 'Bach, BWV 988', file: 'audio/goldberg-aria.mp3', seed: 23, len: 22, base: 196, step: 0.45 },
  'night-garden': { title: 'Night Garden (score)', sub: 'R. Okafor & Ada Lin', file: 'audio/night-garden.mp3', seed: 37, len: 20, base: 130.8, step: 0.7 },
  'softfold-hum': { title: 'Softfold, inflating', sub: 'Field recording, lab', file: 'audio/softfold-pump.mp3', seed: 41, len: 12, base: 110, step: 0.35 },
  'voice-memo': { title: 'Voice memo, 3 am', sub: 'Lab notes', file: 'audio/voice-memo.mp3', seed: 53, len: 14, base: 146.8, step: 0.4 },
}
