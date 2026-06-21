import { transcribirAudioImpro } from '../../structure/services/groq';

export async function transcribirAudioJuego(audioBlob: Blob | null): Promise<string> {
  return transcribirAudioImpro(audioBlob);
}
