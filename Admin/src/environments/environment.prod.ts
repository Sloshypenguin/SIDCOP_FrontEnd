const usuarioId = localStorage.getItem('usuarioId');
const idUsuario = usuarioId ? parseInt(usuarioId, 10) : null; // Usa null como valor predeterminado si no hay ID

export const environment = {
  production: true,
  defaultauth: 'firebase',
  firebaseConfig: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: ''
  },
  apiBaseUrl: 'https://localhost:7071', // URL de producción para SIDCOP
  apiKey: 'bdccf3f3-d486-4e1e-ab44-74081aefcdbc',
  usua_Id: idUsuario // Se establecerá dinámicamente al iniciar sesión
};
