import { Slide } from "@mui/material";

export default {
  snackbar: {
    anchorOrigin: { 
      vertical: 'bottom',
      horizontal: 'left' 
    },
    autoHideDuration: 5000,
    slots: {
      transition: Slide
    },
  },
}