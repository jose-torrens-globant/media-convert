import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Fade from "@mui/material/Fade";
import CircularProgress from "@mui/material/CircularProgress";
// import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";

type DialogTitleProps = {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
};

type DialogProps = {
  children?: React.ReactNode;
  onClose: () => void;
  open: boolean;
  modalTitle: string;
  onClickActionButton: () => void;
  titleActionButton: string;
  loading?: boolean;
  disableButton?: boolean;
};

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          {/* <CloseIcon /> */}
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

export default function CustomizedDialogs(props: DialogProps) {
  const {
    open,
    onClose,
    modalTitle,
    children,
    onClickActionButton,
    titleActionButton,
    loading,
    disableButton,
  } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        className="custom-modal"
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          {modalTitle}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          {" "}
          <Fade
            in={loading}
            style={{
              transitionDelay: loading ? "800ms" : "0ms",
            }}
            unmountOnExit
          >
            <CircularProgress />
          </Fade>
          {!loading && children}
        </DialogContent>
        <DialogActions>
          <Button
            disabled={disableButton}
            autoFocus
            onClick={onClickActionButton}
          >
            {titleActionButton}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
