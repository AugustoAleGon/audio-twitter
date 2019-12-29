import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer';
import uuidv4 from 'uuid/v4';

import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import ShareIcon from '@material-ui/icons/Share';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { green, red, blue } from '@material-ui/core/colors';

import PauseIcon from '@material-ui/icons/Pause';
import Grid from '@material-ui/core/Grid';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Divider from '@material-ui/core/Divider';

const faces = [
  'http://i.pravatar.cc/300?img=1',
  'http://i.pravatar.cc/300?img=2',
  'http://i.pravatar.cc/300?img=3',
  'http://i.pravatar.cc/300?img=4',
];

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 600,
    minWidth: 240,
  },
  wavesurfer: {
    width: '100%',
  },
  flex: {
    flex: 1,
  },
  buttons: {
    paddingTop: theme.spacing(1),
  },
  controls: {
    minWidth: '100px',
  },
  icon: {
    height: 18,
    width: 18,
  },
  avatar: {
    display: 'inline-block',
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  avatarItem: {
    paddingRight: theme.spacing(1),
  },
  bold: {
    fontWeight: 700,
  },
}));

function MessagePlayer({ path }) {
  const wavesurfer = useRef(null);

  const [playerReady, setPlayerReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const wavesurferId = `wavesurfer--${uuidv4()}`;

  useEffect(() => {
    wavesurfer.current = WaveSurfer.create({
      container: `#${wavesurferId}`,
      waveColor: 'grey',
      progressColor: 'tomato',
      height: 70,
      cursorWidth: 1,
      cursorColor: 'lightgray',
      barWidth: 2,
      normalize: true,
      responsive: true,
      fillParent: true,
    });

    wavesurfer.current.load(path);

    wavesurfer.current.on('ready', () => {
      setPlayerReady(true);
    });

    const handleResize = wavesurfer.current.util.debounce(() => {
      wavesurfer.current.empty();
      wavesurfer.current.drawBuffer();
    }, 150);

    wavesurfer.current.on('play', () => setIsPlaying(true));
    wavesurfer.current.on('pause', () => setIsPlaying(false));
    window.addEventListener('resize', handleResize, false);
  }, []);

  const togglePlayback = () => {
    if (!isPlaying) {
      wavesurfer.current.play();
    } else {
      wavesurfer.current.pause();
    }
  };

  const stopPlayback = () => wavesurfer.current.stop();

  const classes = useStyles();

  let transportPlayButton;

  if (!isPlaying) {
    transportPlayButton = (
      <IconButton onClick={togglePlayback}>
        <PlayArrowIcon className={classes.icon} />
      </IconButton>
    );
  } else {
    transportPlayButton = (
      <IconButton onClick={togglePlayback}>
        <PauseIcon className={classes.icon} />
      </IconButton>
    );
  }

  return (
    <>
      <ListItem className={classes.root}>
        <Grid container>
          <Grid item className={classes.avatarItem}>
            <Avatar className={classes.avatar} src={faces[0]} />
          </Grid>
          <Grid item className={classes.flex}>
            <Grid item>
              <Typography className={classes.bold} display="inline">
                Username
              </Typography>
              <Typography display="inline"> · </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                display="inline"
              >
                11h
              </Typography>
            </Grid>
            <Grid container direction="column">
              <Grid
                item
                className={classes.wavesurfer}
                id={wavesurferId}
              />
              <Grid item>
                <Grid
                  container
                  justify="space-between"
                  className={classes.buttons}
                >
                  <Grid item>
                    <Grid container spacing={1}>
                      <Grid item>{transportPlayButton}</Grid>
                      <Grid item>
                        <IconButton onClick={stopPlayback}>
                          <StopIcon className={classes.icon} />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Grid container spacing={3}>
                      <Grid item>
                        <IconButton>
                          <FavoriteIcon
                            style={{ color: blue[500] }}
                            className={classes.icon}
                          />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton>
                          <ShareIcon
                            style={{ color: red[500] }}
                            className={classes.icon}
                          />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton>
                          <ChatBubbleIcon
                            style={{ color: green[500] }}
                            className={classes.icon}
                          />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </ListItem>
      <Divider />
    </>
  );
}

export default MessagePlayer;
