import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Stack,
  TextField
} from '@material-ui/core';
import { Formik } from 'formik';
import { isEmpty } from 'lodash';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import UserSchema from 'src/schemas/UserSchema';
import { API } from 'src/services/api';
import ToastAnimated, { showToast } from '../Toast';

const UserCreate = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  /**
   * Envia os dados do advogado
   * @param {*} values
   */
  async function sendUser(values) {
    setSubmitting(true);
    setShowSuccess(false);

    const treatedValues = {
      name: values.name,
      email: values.email,
      password: values.password,
      is_advocate: values.profile === '1' ? 1 : 0,
      is_client: values.profile === '2' ? 1 : 0
    };

    await API.post('register', treatedValues)
      .then(() => {})
      .catch((err) => {
        setShowSuccess(false);
        setError(err.response.data.errors);
      })
      .finally(() => {
        setSubmitting(false);
        setShowSuccess(true);
      });
  }

  /**
   * Envia os dados do formulário
   * @param {*} values
   */
  const handleSubmit = (values, errors) => {
    if (isEmpty(errors)) sendUser(values);
  };

  return (
    <Formik
      initialValues={{
        name: '',
        email: '',
        password: '',
        profile: '0'
      }}
      validationSchema={UserSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, handleBlur, handleChange, values, submitForm }) => (
        <form
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            setShowSuccess(false);
            handleSubmit(values, errors);
          }}
        >
          <Card>
            <Card>
              <CardHeader title="Dados do usuário" />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={errors.name}
                      fullWidth
                      helperText={errors.name}
                      label="Nome do usuário"
                      name="name"
                      onBlur={(event) => {
                        handleBlur(event);
                        setShowSuccess(false);
                      }}
                      onChange={(event) => {
                        handleChange(event);
                        setShowSuccess(false);
                      }}
                      value={values.name}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={
                        errors.email ||
                        (error && error.email ? error.email[0] : '')
                      }
                      fullWidth
                      helperText={
                        errors.email ||
                        (error && error.email ? error.email[0] : '')
                      }
                      label="Email"
                      name="email"
                      onBlur={(event) => {
                        handleBlur(event);
                        setShowSuccess(false);
                      }}
                      onChange={(event) => {
                        handleChange(event);
                        setShowSuccess(false);
                      }}
                      required
                      value={values.email}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={errors.password}
                      fullWidth
                      helperText={errors.password}
                      label="Senha"
                      margin="normal"
                      name="password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="password"
                      value={values.password}
                      variant="outlined"
                      required
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={errors.confirm_password}
                      fullWidth
                      helperText={errors.confirm_password}
                      label="Confirmar senha"
                      margin="normal"
                      name="confirm_password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="password"
                      value={values.confirm_password}
                      variant="outlined"
                      required
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={errors.profile}
                      fullWidth
                      helperText={errors.profile}
                      label="Vincular perfil do usuário"
                      name="profile"
                      onBlur={(event) => {
                        handleBlur(event);
                        setShowSuccess(false);
                      }}
                      onChange={(event) => {
                        handleChange(event);
                        setShowSuccess(false);
                      }}
                      required
                      select
                      SelectProps={{ native: true }}
                      value={values.profile}
                      variant="outlined"
                    >
                      <option key="0" value="0">
                        Selecione uma opção
                      </option>
                      <option key="1" value="1">
                        Advogado
                      </option>
                      <option key="2" value="2">
                        Cliente
                      </option>
                    </TextField>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Divider />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                p: 2
              }}
            >
              <Stack direction="row" spacing={2}>
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={() => navigate('/users')}
                >
                  Voltar
                </Button>
                {submitting ? (
                  <Button color="primary" variant="contained" disabled>
                    Carregando..
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    variant="contained"
                    type="submit"
                    onClick={submitForm}
                  >
                    Salvar
                  </Button>
                )}
              </Stack>
            </Box>
          </Card>
          {showSuccess && (
            <>
              <ToastAnimated />
              {showToast({
                type: 'success',
                message: 'Usuário criado com sucesso!'
              })}
            </>
          )}
        </form>
      )}
    </Formik>
  );
};

export default UserCreate;
