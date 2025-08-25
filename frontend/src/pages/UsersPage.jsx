import ColourButton from "../components/ColourButton";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUsers } from "../api/user.service";
import { useSnackbar } from "../context/SnackbarContext";
import UsersTable from "../components/UsersTable";
import AddUserForm from "../components/AddUserForm";

import HomeIcon from "@mui/icons-material/Home";

const UsersPage = () => {
  const { user, token } = useAuth();
  const { showSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isAddUserFormOpen, setIsAddUserFormOpen] = useState(false);

  const openAddUserForm = () => {
    if (!user || user.role !== "superadmin") {
      showSnackbar(
        "You do not have permission to perform this action.",
        "error"
      );
      return;
    }
    setIsAddUserFormOpen(true);
  };
  const closeAddUserForm = () => {
    setIsAddUserFormOpen(false);
  };

  const handleBack = () => {
    setLoading(true);
    navigate(-1);
  };

  const fetchUsers = useCallback(async () => {
    try {
      if (token) {
        const usersData = await getUsers(token);
        setUsers(usersData);
      }
    } catch (err) {
      showSnackbar(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [token, setUsers, setLoading, showSnackbar]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    // <div className="p-8 flex flex-col gap-10">
    <div
      className="bg-cover bg-top bg-fixed min-h-screen flex flex-col p-8 gap-10"
      style={{
        backgroundImage:
          "url('https://cdn.properties.emaar.com/wp-content/uploads/2023/09/MicrosoftTeams-image-70-e1694072306832.jpg')",
      }}
    >
      <div className="text-3xl font-medium flex justify-between px-20">
        <div className="flex items-center gap-3">
          <ColourButton
            startIcon={<HomeIcon />}
            onClick={() => (window.location.href = "/dashboard")}
            sx={{
              minWidth: 0,
              display: "flex",
              alignItems: "center",
              paddingLeft: 3.5,
            }}
            aria-label="Go to Home"
          />
          <span className="text-3xl font-semibold text-gray-800">Users List</span>
        </div>
        <ColourButton startIcon={<AddIcon />} onClick={openAddUserForm}>
          Add User
        </ColourButton>
        {isAddUserFormOpen && (
          <AddUserForm
            open={isAddUserFormOpen}
            onClose={closeAddUserForm}
            onSucces={fetchUsers}
          />
        )}
      </div>

      <UsersTable users={users} onSuccess={fetchUsers} />
    </div>
  );
};

export default UsersPage;
