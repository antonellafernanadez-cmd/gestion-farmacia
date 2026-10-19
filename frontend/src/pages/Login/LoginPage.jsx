import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Logo from "../../components/common/Logo";
import { useAuth } from "../../context/AuthContext";
import { obtenerMensajeError } from "../../utils/errores";
import { colores } from "../../theme";

// Pantalla de inicio de sesión. Hay dos cuentas compartidas (administración y empleados);
// el backend responde con el rol y desde ahí el menú muestra lo que corresponde.
export default function LoginPage() {
  const { usuario, cargando, iniciarSesion } = useAuth();
  const ubicacion = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verPassword, setVerPassword] = useState(false);
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Si ya hay sesión, no tiene sentido mostrar el login: va a la pantalla que quería abrir.
  const destino = ubicacion.state?.desde?.pathname || "/";
  if (!cargando && usuario) {
    return <Navigate to={destino} replace />;
  }

  const enviar = async (evento) => {
    evento.preventDefault();

    // Validación en el frontend (el backend valida de nuevo por seguridad)
    const nuevos = {};
    if (!email.trim()) nuevos.email = "Ingresá tu email";
    if (!password) nuevos.password = "Ingresá tu contraseña";
    setErrores(nuevos);
    setErrorServidor("");
    if (Object.keys(nuevos).length > 0) return;

    setEnviando(true);
    try {
      await iniciarSesion(email.trim(), password);
      // Al guardarse el usuario, el <Navigate> de arriba redirige solo.
    } catch (error) {
      // Por ejemplo: 401 "Email o contraseña incorrectos"
      setErrorServidor(obtenerMensajeError(error, "No se pudo iniciar sesión"));
      setEnviando(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        p: 2,
        background: `linear-gradient(160deg, ${colores.azulOscuro} 0%, ${colores.azulSecundario} 100%)`,
      }}
    >
      <Paper sx={{ width: "100%", maxWidth: 420, p: { xs: 3, sm: 4.5 }, borderRadius: 3 }}>
        <Logo />
        <Typography variant="h5" component="h1" sx={{ mt: 3 }}>
          Iniciar sesión
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>
          Ingresá con la cuenta de tu farmacia.
        </Typography>

        <Box component="form" onSubmit={enviar} noValidate sx={{ display: "grid", gap: 2.5 }}>
          {errorServidor && <Alert severity="error">{errorServidor}</Alert>}

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrores((previos) => ({ ...previos, email: "" }));
            }}
            error={Boolean(errores.email)}
            helperText={errores.email}
            autoComplete="username"
            autoFocus
            required
          />
          <TextField
            label="Contraseña"
            type={verPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrores((previos) => ({ ...previos, password: "" }));
            }}
            error={Boolean(errores.password)}
            helperText={errores.password}
            autoComplete="current-password"
            required
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={verPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      onClick={() => setVerPassword((visible) => !visible)}
                      edge="end"
                    >
                      {verPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button type="submit" variant="contained" size="large" disabled={enviando}>
            {enviando ? "Ingresando…" : "Ingresar"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}