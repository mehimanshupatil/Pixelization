/* eslint-disable jsx-a11y/alt-text */
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';

import './App.css';
import pixelFn from './helper/pixelization';
import { CircularProgress } from '@mui/material';
import { Box } from '@mui/system';

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
};

function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

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
    setLoading(false);
  };

  const imageSelected = (e: ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const files = e.target.files;
    if (e.target.files && e.target.files[0]) {
      const img = document.getElementById('original') as HTMLImageElement;
      // @ts-ignore
      img.src = URL.createObjectURL(files[0]);
      img.onload = () => {
        run(img);
      };
    }
  };

  return (
    <div className='App'>
      <Button
        variant='contained'
        sx={{ mt: 2 }}
        onClick={() => inputRef.current && inputRef.current.click()}
      >
        Select image
      </Button>
      <input className='hiddenInput' type='file' ref={inputRef} onChange={imageSelected} />
      <img id='original' />

      {loading && (
        <Modal open>
          <Box sx={style}>
            <CircularProgress color='info' />
            processing Image
          </Box>
        </Modal>
      )}

      <ImageList sx={{ width: '100vw' }} cols={1} variant='standard'>
        {Object.keys(pixelations).map((key) => (
          <ImageListItem sx={{ m: 5 }} key={key}>
            <img id={key} />
          </ImageListItem>
        ))}
      </ImageList>
    </div>
  );
}

export default App;
