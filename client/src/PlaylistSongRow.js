//functional imports
import React, { useContext } from 'react'
import { SpotifyContext } from "./SpotifyContext";

//css and component imports
import './SongRow.css'
import './SidebarOption'

//material ui imports
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import AddIcon from '@mui/icons-material/Add';

function PlaylistSongRow({song}) {
    //set state from context
    const { setCurrentTrack } = useContext(SpotifyContext);

console.log("song", song)

  return (
    <Grid container className="songRow" width="700px">

        <Grid item xs={1}>
        <img src={song.cover_art} alt={song.name} className="songRow__album" />
        </Grid>

        <Grid item xs={5}>
        <div className="songRow__info">
          <h1>{song.name}</h1>
          <p>
            {/* {track.artists.map((artist) => artist.name).join(", ")} -{" "}
            {track.album.name} */}
          </p>
        </div>
        </Grid>

      <Grid item xs={3}>
        <Button 
          onClick={() => {setCurrentTrack(song)}}
          className='sidebarOption'
          sx={{
            color: 'grey',
            textTransform: 'none',
            height: '30px',
            marginRight: '50px',
            fontSize: '16px',
          }}
        >
        <PlayCircleIcon sx={{marginRight: '5px'}}/>
          <h4>Track</h4>
        </Button>
        </Grid>
    </Grid>
  )
}

export default PlaylistSongRow;