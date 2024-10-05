import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  CircularProgress,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Stack,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("jwtToken"));

  const api = axios.create({
    baseURL: "http://localhost:3000/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    // Obter a lista de usuários
    api
      .get("/users")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar usuários:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [api]);

  const handleDeleteUser = (userId) => {
    setDeleteUserId(userId);
  };

  const handleConfirmDelete = () => {
    api
      .delete(`/users/${deleteUserId}`)
      .then(() => {
        setUsers(users.filter((user) => user.id !== deleteUserId));
        setDeleteUserId(null);
      })
      .catch((error) => {
        console.error("Erro ao deletar usuário:", error);
      });
  };

  const handleCancelDelete = () => {
    setDeleteUserId(null);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleSaveUser = () => {
    api
      .put(`/users/${selectedUser.id}`, selectedUser)
      .then(() => {
        setUsers(
          users.map((user) =>
            user.id === selectedUser.id ? selectedUser : user
          )
        );
        setOpen(false);
        setSelectedUser(null);
      })
      .catch((error) => {
        console.error("Erro ao atualizar usuário:", error);
      });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography
          variant="h4"
          component="h1"
          color="primary"
          fontWeight="bold"
        >
          Lista de Usuários
        </Typography>
        <Button variant="contained" color="primary" sx={{ borderRadius: 8 }}>
          Adicionar Usuário
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Card variant="outlined" sx={{ borderRadius: 4 }}>
          <CardContent>
            <List>
              {users.map((user) => (
                <ListItem
                  key={user.id}
                  sx={{ borderBottom: "1px solid #e0e0e0" }}
                >
                  <PersonIcon color="primary" sx={{ mr: 2 }} />
                  <ListItemText
                    primary={
                      <Typography
                        variant="h6"
                        color="textPrimary"
                        fontWeight="medium"
                      >
                        {user.name}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="textSecondary">
                        {user.email}
                      </Typography>
                    }
                  />
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      color="primary"
                      onClick={() => handleEditUser(user)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Dialog para Editar Usuário */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Editar Usuário</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Edite as informações do usuário abaixo:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Nome"
            fullWidth
            value={selectedUser?.name || ""}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, name: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={selectedUser?.email || ""}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, email: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSaveUser} color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para Confirmar Exclusão */}
      <Dialog open={!!deleteUserId} onClose={handleCancelDelete}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir este usuário?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagement;
