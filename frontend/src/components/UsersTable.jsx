
import React from "react";
import {
  Box,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  tableCellClasses,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Slide from "@mui/material/Slide";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserById, getUsers, deleteUser } from "../api/user.service";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import EditUserForm from "./EditUserForm";
import { useSnackbar } from "../context/SnackbarContext";
import DeleteIcon from "@mui/icons-material/Delete";
import ColourButton from "./ColourButton";

const UsersTable = ({ users, onSuccess }) => {
  const { user:loggedInUser, token } = useAuth();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [editUserForm, setEditUserForm] = useState(false);

  const [singleUserData, setSingleUserData] = useState();
  const [loading, setLoading] = useState(false);

  const openForm = () => setEditUserForm(true);
  const closeForm = async () => {
    setEditUserForm(false);
    setSingleUserData(null);
    onSuccess();
  };

  const [deleteDialogueOpen, setDeleteDialogueOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleDeleteDialogueOpen = (user) => {
    if (!loggedInUser || loggedInUser.role !== "superadmin") {
      showSnackbar(
        "You do not have permission to perform this action.",
        "error"
      );
      return;
    }
    setUserToDelete(user);
    setDeleteDialogueOpen(true);
  };
  const handleDeleteDialogueClose = () => {
    setDeleteDialogueOpen(false);
    setUserToDelete(null);
    onSuccess();
  };

  

  const handleEditButtonClick = async (id, token) => {

    if (!loggedInUser || loggedInUser.role !== "superadmin") {
      showSnackbar(
        "You do not have permission to perform this action.",
        "error"
      );
      return;
    }

    try {
      setLoading(true);
      setSingleUserData(null);

      const userData = await getUserById(id, token);

      setSingleUserData(userData);
      openForm();
    } catch (error) {
      showSnackbar(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setLoading(true);
    try {
      const response = await deleteUser(userToDelete.userId, token);

      if (response?.message === "User deleted successfully.") {
        showSnackbar("User Removed", "success");
      } else {
        showSnackbar(response?.message || "Failed to remove user.", "error");
      }
      setDeleteDialogueOpen(false);
      setUserToDelete(null);
      onSuccess();
    } catch (error) {
      showSnackbar(error?.message || "Failed to remove user.", "error");
    } finally {
      setLoading(false);
    }
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 16,
    },
  }));

  return (
    <div className="px-20">
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          overflow: "hidden",
          backgroundColor: "rgba(355, 355, 355, 0.60)",
            backdropFilter: "blur(70px)",
          
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <StyledTableCell sx={{ fontWeight: "bold", fontSize: 17 }}>
                Name
              </StyledTableCell>
              <StyledTableCell sx={{ fontWeight: "bold", fontSize: 17 }}>
                Access Level
              </StyledTableCell>
              <StyledTableCell />
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user, index) => (
              <TableRow
                key={user.userId}
                sx={{
                  // backgroundColor: index % 2 === 0 ? "#fff" : "#fafafa",
                  transition: "background-color 0.2s ease",
                  "&:hover": { backgroundColor: "#f0f0f0" },
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell sx={{ py: 1.5, fontSize: 15 }}>
                  {user.name}
                </TableCell>
                <TableCell
                  sx={{ py: 1.5, fontSize: 15, textTransform: "capitalize" }}
                >
                  {user.role}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleEditButtonClick(user.userId, token)}
                    sx={{
                      backgroundColor: "#212121",
                      color: "white",
                      mx: 1,
                      p: 1,
                      "&:hover": {
                        backgroundColor: "#333",
                      },
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    size="small"
                    onClick={() => handleDeleteDialogueOpen(user)}
                    sx={{
                      backgroundColor: "red",
                      color: "white",
                      p: 1,
                      "&:hover": {
                        backgroundColor: "#333",
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {editUserForm && (
        <EditUserForm
          open={editUserForm}
          onClose={closeForm}
          user={singleUserData}
        />
      )}

      <Dialog
        open={deleteDialogueOpen}
        keepMounted
        onClose={handleDeleteDialogueClose}
      >
        <DialogTitle>
          {`Remove User${userToDelete ? ` - ${userToDelete.name}` : ""}`}
        </DialogTitle>
        <Typography sx={{ px: 3, color: "text.secondary", fontSize: 14 }}>
          This action cannot be undone.
        </Typography>
        <DialogActions sx={{ alignSelf: "center", py: 3 }}>
          <ColourButton onClick={handleDeleteDialogueClose}>
            Cancel
          </ColourButton>
          <Button
            variant="contained"
            onClick={handleDeleteUser}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UsersTable;
