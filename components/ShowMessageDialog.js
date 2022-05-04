import React from 'react';
import ReactDOM from 'react-dom';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon sx={{fontSize: "40px"}} />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

const MessageDialog = (props) => {
  const {onClose, visible, type, title, body} = props;

  return (
    <Dialog
      onClose={onClose}
      open={visible}
    >
      <BootstrapDialogTitle
        onClose={onClose}
      >
        <div className='flex justify-start items-center'>
          {type === 'success' ? <CheckCircleIcon color='success' sx={{fontSize: "40px"}} /> : <ErrorIcon color='error' sx={{fontSize: "40px"}}/>}
          <span className='ml-3 text-2xl text-black'>{title}</span>
        </div>

      </BootstrapDialogTitle>
      <DialogContent dividers>
        {body}
      </DialogContent>

    </Dialog>
  );
}

const ShowMessageDialog = (props) => {
  const {title, body, type} = props;
  const container = document.createDocumentFragment();

  function render({visible}) {
    ReactDOM.render(
      <MessageDialog 
        title={title}
        visible={visible}
        body={body}
        type={type}
        onClose={close}
      />,
      container
    );
  }

  function close() {
    render({visible: false});
  }

  render({visible: true});
  
}

export default ShowMessageDialog;