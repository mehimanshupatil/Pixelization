/* eslint-disable jsx-a11y/alt-text */
import React, { ChangeEvent, useRef, useState } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/system/Box';
import Typography from '@mui/material/Typography';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import IconButton from '@mui/material/IconButton';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import './App.css';
import pixelFn from './helper/pixelization';
import { download, randomOptions } from './helper/helper';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  gap: 4,
  color: 'white',
};

const pixelations = {
  officer: [
    { shape: 'diamond', resolution: 48, size: 50 },
    { shape: 'diamond', resolution: 48, offset: 24 },
    { shape: 'circle', resolution: 8, size: 6 },
  ],
  stanley: [
    { resolution: 32 },
    { shape: 'circle', resolution: 32, offset: 15 },
    { shape: 'circle', resolution: 32, size: 26, offset: 13 },
    { shape: 'circle', resolution: 32, size: 18, offset: 10 },
    { shape: 'circle', resolution: 32, size: 12, offset: 8 },
  ],
  'take-my-portrait': [
    { resolution: 48 },
    { shape: 'diamond', resolution: 48, offset: 12, alpha: 0.5 },
    { shape: 'diamond', resolution: 48, offset: 36, alpha: 0.5 },
    { shape: 'circle', resolution: 16, size: 8, offset: 4, alpha: 0.5 },
  ],
  tony: [
    { shape: 'circle', resolution: 32, size: 6, offset: 8 },
    { shape: 'circle', resolution: 32, size: 9, offset: 16 },
    { shape: 'circle', resolution: 32, size: 12, offset: 24 },
    { shape: 'circle', resolution: 32, size: 9, offset: 0 },
  ],
  wonder: [
    { shape: 'diamond', resolution: 24, size: 25 },
    { shape: 'diamond', resolution: 24, offset: 12 },
    { resolution: 24, alpha: 0.5 },
  ],
  anita: [
    { shape: 'square', resolution: 32 },
    { shape: 'circle', resolution: 32, offset: 16 },
    { shape: 'circle', resolution: 32, offset: 0, alpha: 0.5 },
    { shape: 'circle', resolution: 16, size: 9, offset: 0, alpha: 0.5 },
  ],
  giraffe: [
    { shape: 'circle', resolution: 24 },
    { shape: 'circle', resolution: 24, size: 9, offset: 12 },
  ],
  kendra: [
    { shape: 'square', resolution: 48, offset: 24 },
    { shape: 'circle', resolution: 48, offset: 0 },
    { shape: 'diamond', resolution: 16, size: 15, offset: 0, alpha: 0.6 },
    { shape: 'diamond', resolution: 16, size: 15, offset: 8, alpha: 0.6 },
  ],
  gavin: [
    { shape: 'square', resolution: 48 },
    { shape: 'diamond', resolution: 12, size: 8 },
    { shape: 'diamond', resolution: 12, size: 8, offset: 6 },
  ],
  t1: [{ resolution: 24 }],
  t2: [{ resolution: 24 }, { shape: 'circle', resolution: 24, size: 16, offset: 12, alpha: 0.5 }],
  new: [
    { shape: 'diamond', resolution: 3, size: 7, offset: 8 },
    { shape: 'circle', resolution: 8, size: 9, offset: 3 },
  ],
  new2: [
    { alpha: 0.5, offset: 6, resolution: 30, shape: 'circle', size: 33 },
    { alpha: 1, offset: 23, resolution: 16, shape: 'circle', size: 15 },
    { alpha: 0.9, offset: 21, resolution: 17, shape: 'square', size: 8 },
  ],
  new3: [
    { shape: 'diamond', resolution: 8, size: 3, offset: 6 },
    { shape: 'square', resolution: 0, size: 5, offset: 6 },
  ],
  new4: [
    { shape: 'square', resolution: 12, size: 8, offset: 0, alpha: 0.9 },
    { shape: 'circle', resolution: 30, size: 8, offset: 14, alpha: 1 },
  ],
  new5: [
    { shape: 'diamond', resolution: 9, size: 2, offset: 18 },
    { shape: 'diamond', resolution: 16, size: 13, offset: 16 },
  ],
};

const customArtId = 'customArt';

function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [loading, setLoading] = useState(false);

  const [imgSelected, setImgSelected] = useState(false);

  const run = (ogImg: HTMLImageElement) => {
    for (let key in pixelations) {
      const pix = pixelFn();
      const img = document.getElementById(key) as HTMLImageElement,
        // @ts-ignore
        options = pixelations[key];
      if (img) {
        pix(img, ogImg, options);
      }
    }
    setImgSelected(true);
    setLoading(false);
  };

  const imageSelected = (e: ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const files = e.target.files;
    if (e.target.files && e.target.files[0]) {
      const img = imgRef.current as HTMLImageElement;
      // @ts-ignore
      img.src = URL.createObjectURL(files[0]);
      img.onload = () => {
        run(img);
      };
    } else setLoading(false);
  };

  const generate = () => {
    const pix = pixelFn();
    const img = imgRef.current as HTMLImageElement;
    const img2Replace = document.getElementById(customArtId) as HTMLImageElement;

    const optionslist = randomOptions();
    console.log('options', optionslist);
    pix(img2Replace, img, optionslist);
  };

  const mergeImg = () => {
    const gridSize = 4;
    const ogCanvs = document.getElementById('mergeCanvas') as HTMLCanvasElement;
    if (imgRef.current) {
      ogCanvs.width = imgRef.current.width * gridSize;
      ogCanvs.height = imgRef.current.height * gridSize;
    }
    const ctx = ogCanvs.getContext('2d');
    const ids = Object.keys(pixelations);
    if (!ctx) return;

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const canvs = document.getElementById(ids[x * gridSize + y]) as HTMLCanvasElement;
        ctx.drawImage(canvs, x * canvs.width, y * canvs.height, canvs.width, canvs.height);
      }
    }
  };

  return (
    <div className='App'>
      <Typography variant='h2' component='div' gutterBottom>
        Pixelize you image
      </Typography>
      <Button
        variant='contained'
        sx={{ mt: 2 }}
        onClick={() => inputRef.current && inputRef.current.click()}
      >
        Select image
      </Button>
      <input className='hiddenInput' type='file' ref={inputRef} onChange={imageSelected} />
      <img id='original' ref={imgRef} />

      {loading && (
        <Modal open>
          <Box sx={style}>
            <CircularProgress color='info' />
            processing Image
          </Box>
        </Modal>
      )}
      {imgSelected && (
        <>
          <br />
          <Button variant='contained' sx={{ mt: 2 }} onClick={mergeImg}>
            merge images
          </Button>
          <ImageListItem>
            <canvas id='mergeCanvas' />
            <ImageListItemBar
              sx={{
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.7) 0%, ' +
                  'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
              }}
              actionIcon={
                <IconButton
                  sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                  onClick={() => download('mergeCanvas')}
                >
                  <FileDownloadIcon />
                </IconButton>
              }
            />
          </ImageListItem>
        </>
      )}

      <ImageList sx={{ width: '100vw' }} cols={1} variant='standard'>
        {Object.keys(pixelations).map((key) => (
          <ImageListItem sx={{ m: 5 }} key={key}>
            <img id={key} />
            {imgSelected && (
              <ImageListItemBar
                sx={{
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.7) 0%, ' +
                    'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                }}
                actionIcon={
                  <IconButton
                    sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                    onClick={() => download(key)}
                  >
                    <FileDownloadIcon />
                  </IconButton>
                }
              />
            )}
          </ImageListItem>
        ))}
      </ImageList>

      {imgSelected && (
        <>
          <Typography variant='h4' component='div' gutterBottom>
            random art generator
          </Typography>
          <Button variant='contained' sx={{ mt: 2 }} onClick={generate}>
            Generate
          </Button>
          <ImageList sx={{ width: '100vw' }} cols={1} variant='standard'>
            <ImageListItem sx={{ m: 5 }}>
              <img id={customArtId} />
              <ImageListItemBar
                sx={{
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.7) 0%, ' +
                    'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                }}
                actionIcon={
                  <IconButton
                    sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                    onClick={() => download(customArtId)}
                  >
                    <FileDownloadIcon />
                  </IconButton>
                }
              />
            </ImageListItem>
          </ImageList>
        </>
      )}
    </div>
  );
}

export default App;
