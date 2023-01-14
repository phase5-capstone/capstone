//functional imports
import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { SpotifyContext } from "./SpotifyContext";

// css and component imports
import "./Body.css";
import "./App.css";
import SongRow from "./SongRow";

//material ui imports
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import InputBase from '@mui/material/InputBase';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';


function Playlist() {
  const { currentPlaylist, setCurrentPlaylist, localUser, setLocalUser } = useContext(SpotifyContext);
  const [errors, setErrors] = useState([]);
  const [form, setForm] = useState(currentPlaylist);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [tracks, setTracks] = useState([]);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
  console.log("state of playlist", currentPlaylist)
    if (params.id.length < 20 ) {
      console.log("params are a length of less than 20")
      let thisPagesPlaylist = localUser.playlists.find((playlist) => {
        // debugger
        if (playlist.id.toString() === params.id) {
          return playlist
        }
      })
      setCurrentPlaylist(thisPagesPlaylist)
    }
    //going to have to add the logic to fetch a playlist from spotify for
    //spotify_users playlists and for specific search
  }, [params, localUser])

  useEffect(() => {
    setForm(currentPlaylist)
  }, [currentPlaylist])

  function handleSave(e) {
    e.preventDefault()
    fetch(`/playlists/${currentPlaylist.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        image: form.image
      })
    }).then((res) => {
      if (res.ok) {
        res.json().then((updatedPlaylist) => {
          setCurrentPlaylist(updatedPlaylist)
          let updatedPlaylists = localUser.playlists.map((pl) => {
            if (params.id === pl.id.toString()) {
              return updatedPlaylist
            } else {
              return pl
            }
          })
       
          setLocalUser({...localUser, playlists: updatedPlaylists})
        });
      } else {
        res.json().then((err) => {
          setErrors(err.error)
        });
      }
    })
    setOpen(false);
  }
  
  function handleAddTrack(track) {
    console.log("handle add track firing")
    fetch(`/playlists/${currentPlaylist.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ trackId: track.id })
    }).then((res) => {
      if (res.ok) {
        res.json().then((updatedPlaylist) => {
          setCurrentPlaylist(updatedPlaylist)
          let updatedPlaylists = localUser.playlists.map((pl) => {
            if (params.id === pl.id) {
              return updatedPlaylist
            } else {
              return pl
            }
          })
          setLocalUser({...localUser, playlists: [updatedPlaylists]})
        });
      } else {
        res.json().then((err) => {
          setErrors(err.error)
        });
      }
    })
  }

  function handleDeletePlaylist (e) {
    e.preventDefault()
    fetch(`/playlists/${currentPlaylist.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(),
    }).then((res) => {
      if (res.ok) {
        let updatedPlaylists = localUser.playlists.filter((pl) => currentPlaylist.id !== pl.id)
        setLocalUser({...localUser, playlists: updatedPlaylists})
        setCurrentPlaylist({})
        navigate("/home")
      } else {
        res.json().then((err) => {
          setErrors(err.errors)});
      }
    })
    handleCloseDeleteMenu()
  }
  function handleDialogUpdate(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setForm(currentPlaylist)
  };

  function handleSearchSubmit(e) {
    console.log("handle search submit firing")
    e.preventDefault()
    fetch(`/spotify_api/${search}`)
      .then((res) => {
        if (res.ok) {
          res.json().then((tracks) => {
            setTracks(tracks)
          })
        } else {
          res.json().then((err) => {
            setErrors(err.error)
          });
        }
      })
    setSearch('')
  }

  function handleSearchInputChange(e) {
    setSearch(e.target.value)
  }






  const [anchorEl, setAnchorEl] = React.useState(null);
  const openDeletePlaylist = Boolean(anchorEl);
  const handleOpenDeleteMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseDeleteMenu = () => {
    setAnchorEl(null);
  };




  const handleFormNameClear = (val) => {
    console.log('onclick')
 
  setForm({...form, [val]: ''})
}

  return (
    <>
      <Grid container className="body">
        <div className="body__info">
          {errors.map((error) => {
            return (
              <span key={error} className='error'>
                {error}
              </span>
            );
          })}

          <div onClick={handleClickOpen} >

            <img className="image_class" src={currentPlaylist.image} alt={currentPlaylist.name} />
          </div>
          <div className="body__infoText" onClick={handleClickOpen}>
            <h4>{currentPlaylist.name}</h4>
            <p>{currentPlaylist.description}</p>
            <p>{`${localUser.username}'s playlist`}</p>
          </div>
          <div>
            <Dialog
              open={open}
              onClose={handleClose}
              sx={{ backgroundColor: 'transparent' }}
            >
              <DialogTitle
                sx={{ backgroundColor: '#3b3637', color: 'white' }}
              >Edit and update the details</DialogTitle>
              <DialogContent
                sx={{ backgroundColor: '#3b3637' }}
              >
                <DialogContentText
                  sx={{ color: 'white' }}
                >
                  Change the information below and click save to update your playlist!
                </DialogContentText>
                <TextField
                  sx={{ input: { color: 'white' } }}
                  margin="dense"
                  name="name"
                  fullWidth
                  variant="standard"
                  onChange={handleDialogUpdate}
                  value={form.name}
                  InputProps={{
                    endAdornment: (
                      <div >
                      <InputAdornment>
                        <IconButton onClick={() => { handleFormNameClear('name')}}>
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                      </div>
                    )
                  }}
                />



                <TextField
                  sx={{ input: { color: 'white' } }}
                  margin="dense"
                  name="description"
                  fullWidth
                  variant="standard"
                  onChange={handleDialogUpdate}
                  value={form.description}
                  InputProps={{
                    endAdornment: (
                      <div >
                      <InputAdornment>
                        <IconButton onClick={() => { handleFormNameClear('description')}}>
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                      </div>
                    )
                  }}
                />
                <TextField
                  sx={{ input: { color: 'white' } }}
                  margin="dense"
                  name="image"
                  fullWidth
                  variant="standard"
                  onChange={handleDialogUpdate}
                  value={form.image}
                  InputProps={{
                    endAdornment: (
                      <div >
                      <InputAdornment>
                        <IconButton onClick={() => { handleFormNameClear('image')}}>
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                      </div>
                    )
                  }}
                />
              </DialogContent>
              <DialogActions
                sx={{ backgroundColor: '#3b3637' }}
              >
                <Button onClick={handleClose}
                  sx={{ color: 'white' }}
                >Cancel</Button>
                <Button onClick={handleSave}
                  sx={{ color: 'white' }}
                >Save</Button>
              </DialogActions>
            </Dialog>


          </div>
        </div>
      </Grid>
      <Grid container>

        <Grid item>




          <div>
            <IconButton
              aria-label="more"
              id="long-button"
              aria-controls={openDeletePlaylist ? 'long-menu' : undefined}
              aria-expanded={openDeletePlaylist ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleOpenDeleteMenu}
            >
              <MoreHorizIcon
                sx={{
                  marginLeft: '30px',
                  height: '40px',
                  marginTop: '-50px',
                  color: 'white',
                }}
              />
            </IconButton>
            <Menu
              id="long-menu"
              MenuListProps={{
                'aria-labelledby': 'long-button',
              }}
              anchorEl={anchorEl}
              open={openDeletePlaylist}
              onClose={handleCloseDeleteMenu}

            >

              <MenuItem onClick={handleDeletePlaylist}>
                Delete Playlist
              </MenuItem>

            </Menu>
          </div>






          <form onSubmit={handleSearchSubmit}>
            <Paper
              component="form"
              elevation={0}
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: 250,
                marginLeft: '2em',
                backgroundColor: 'grey'
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search for Songs, Artists or Albums"
                type='text'
                name='search'
                value={search}
                onChange={handleSearchInputChange}
              />
              <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                <SearchIcon onClick={handleSearchSubmit} />
              </IconButton>
            </Paper>
          </form>
        </Grid>
        <Grid item>
          {tracks.length > 0 ?
            tracks.map((track) => {
              return <SongRow track={track} key={track.id} onAddTrack={handleAddTrack} />
            })
            :
            <></>
          }
        </Grid>

      </Grid>
    </>
  )
}

export default Playlist;