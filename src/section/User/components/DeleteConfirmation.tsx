import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface DeleteConfirmationProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  open,
  onClose,
  onConfirm,
  isDeleting,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t("confirmDelete")}</DialogTitle>
      <DialogContent>
        <Typography>{t("deleteDescription")}</Typography>
        <Typography variant="caption" color="error">
          {t("deleteDescription")}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("cancel")}</Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={isDeleting}
        >
          {isDeleting ? <CircularProgress size={20} /> : t("delete")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmation;
