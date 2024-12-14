import ncs from 'nocopyrightsounds-api'
import axios from 'axios'

// // getting the newest 20 songs (20 songs = 1 page)
// const songs = await ncs.getSongs()

// const newestSong = songs[0]
// const audioUrl = newestSong.download.regular

// if (!audioUrl) throw "This Song doesn't have a regular (non instrumental) version!"

// // downloading audio
// const { data: audioFile } = await axios.get(audioUrl, {
//     responseType: 'arraybuffer'
// })


async function DownloadAndPlay() {
    try {
      // Fetch songs from NCS API
      const songs = await ncs.getSongs();
      const newestSong = songs[0];
      const audioUrl = newestSong.download.regular;
  
      if (!audioUrl) throw new Error("This song doesn't have a regular (non-instrumental) version!");
  
      // Downloading the audio file
      const response = await axios.get(audioUrl, { responseType: 'arraybuffer' });
  
      // Creating a Blob from the audio data
      const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
  
      // Creating a URL for the Blob
      const audioObjectUrl = URL.createObjectURL(audioBlob);
  
      // Playing the audio
      const audioElement = document.getElementById('audio-player');
      audioElement.src = audioObjectUrl;
      audioElement.play();
    } catch (error) {
      console.error('Error downloading or playing audio:', error);
    }
  }

  export default DownloadAndPlay