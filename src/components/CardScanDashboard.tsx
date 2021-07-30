import React, { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone';
import { Storage, API } from 'aws-amplify';

import { toast } from 'react-toastify';

import { makeStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles(theme => ({
  card: {
    display: 'inline-grid',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    minWidth: 275,
  },
  fab: {
    margin: theme.spacing(1),
  },
  title: {
    fontSize: 24,
  },
  pos: {
    marginBottom: 12,
  },
  plus: {
    fontSize: 20,
    borderRadius: 10,
    '&:hover': {
      backgroundColor: 'red',
    },
  },
  add: {
    'focus': {
      outline: 'none',
      boxShadow: 'none ! important'
    }
  },
  dragArea: {
    diplay: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 20,
    marginTop: 20,
    backgroundColor: '#f5f5f5'
  }
}));

/* eslint-disable react/prop-types */
const CardScanDashboard = (props) => {

  const classes = useStyles();

  const { acceptedFiles, getRootProps, getInputProps, open } = useDropzone({
    // accept: '.wpress'
  });

  const [openState, setOpen] = useState(false);
  const [, setProgressBar] = useState(false);

  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function submit() {
    // acceptedFiles.map((file) => {
    //   setProgressBar(true);
    //   Storage.put(file.name, file,
    //     {
    //       contentType: file.type,
    //     })
    //     .then(result => {
    //       toast.success("Upload Success!");


    //       setProgressBar(false);
    //     })
    //     .catch(err => {
    //       toast.error("Upload Failed!");
    //     });
    // })

    API.get('wpAPI', '/wp')
      .then(data => {
        console.log("data", data)
      })
      .catch(error => {
        console.log("error", error)
      })
  }

  return (
    <div className="container-fluid">
      <div className="row mt-5 ml-4">
        <div className="col-md-2">
          <Card className={classes.card}>
            <CardActions className="mt-5">
              <Fab aria-label="add" className={classes.fab}>
                <AddIcon onClick={handleClickOpen} />
              </Fab>
            </CardActions>
            <CardContent>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                Scan
              </Typography>
            </CardContent>
          </Card>

          <Dialog
            open={openState}
            onClose={handleClose}
            aria-labelledby="max-width-dialog-title"
          >
            <DialogTitle>
              Create new Scans
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please input scanner url and drag & drop .wpress files to scan. Scan files can be one or more files at a time.
              </DialogContentText>
              <TextField
                margin="dense"
                id="mask"
                label="Scanner Url"
                type="url"
                fullWidth
              />
              <DialogContentText
                {...getRootProps({ className: 'dropzone' })}
                className={classes.dragArea}
              >
                <input {...getInputProps()} />
                Drag 'n' drop some files here, or click to select files
                </DialogContentText>
              <aside>
                <h4>Files</h4>
                <ul>{files}</ul>
              </aside>
              {showProgressBar ? (
                <LinearProgress variant="query" />
              ) : (null)}
            </DialogContent>
            <DialogActions>
              <Button onClick={submit} color="primary">
                Upload
              </Button>
              <Button onClick={handleClose} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div >
  )
}

export default CardScanDashboard
