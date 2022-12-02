import React, { useState, useEffect, useCallback } from "react";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Button,
  Table,
  Spinner,
  Modal,
  Input,
  FormFeedback,
  Label,
  InputGroup,
} from "reactstrap";
import toastr from "toastr";
import {
  ApiGetAccountLists,
  ApiCreateAccount,
  ApiGetDetailAccount,
  ApiUpdateAccount,
  ApiDeleteAccount,
} from "../../api/account";
import { checkPasswordValidation } from "../../utils/regex";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [accountData, setAccountData] = useState([]);
  const [modalForm, setModalForm] = useState({
    isOpen: false,
    title: "",
    isLoading: false,
  });
  const [accountId, setAccountId] = useState("");
  const [formInput, setFormInput] = useState({
    name: {
      value: "",
      errorMessage: "",
    },
    username: {
      value: "",
      errorMessage: "",
    },
    email: {
      value: "",
      errorMessage: "",
    },
    password: {
      value: "",
      errorMessage: "",
    },
  });
  const [modalConfirm, setModalConfirm] = useState({
    isOpen: false,
    title: "",
    description: "",
    isLoading: false,
  });
  const [isShowPassword, setIsShowPassword] = useState(false);

  useEffect(() => {
    handleGetApiAccount();
    handleGetApiAccount();
  }, []);

  const handleGetApiAccount = useCallback(() => {
    ApiGetAccountLists().then(response => {
      if (response.status === 200) {
        setAccountData(response.result.data);
      }

      if (response.status === 204) {
        setAccountData([]);
      }
      setIsLoading(false);
    });
  }, []);

  const handleGetDetailAccount = useCallback(id => {
    ApiGetDetailAccount(id).then(response => {
      if (response.status === 200) {
        setAccountId(response.result.accountId);
        setFormInput(oldState => ({
          ...oldState,
          name: {
            ...oldState.name,
            value: response.result.name,
          },
          username: {
            ...oldState.username,
            value: response.result.username,
          },
          email: {
            ...oldState.email,
            value: response.result.email,
          },
        }));
        setModalForm(oldState => ({
          ...oldState,
          isLoading: false,
        }));
      }
    });
  }, []);

  const handleShowToast = useCallback((message, title) => {
    toastr.options.closeButton = true;
    toastr.options.positionClass = "toast-top-center";
    toastr.options.closeMethod = "fadeOut";
    toastr.options.closeDuration = 300;
    toastr.options.closeEasing = "swing";
    toastr.success(message, title);
  }, []);

  const handleChangeInputName = useCallback(e => {
    const { value } = e.target;
    setFormInput(oldState => ({
      ...oldState,
      name: {
        ...oldState.name,
        value,
        errorMessage: "",
      },
    }));
  }, []);

  const handleChangeInputUsername = useCallback(e => {
    const { value } = e.target;
    setFormInput(oldState => ({
      ...oldState,
      username: {
        ...oldState.username,
        value,
        errorMessage: "",
      },
    }));
  }, []);

  const handleChangeInputEmail = useCallback(e => {
    const { value } = e.target;
    setFormInput(oldState => ({
      ...oldState,
      email: {
        ...oldState.email,
        value,
        errorMessage: "",
      },
    }));
  }, []);

  const handleChangeInputPassword = useCallback(e => {
    const { value } = e.target;
    let errorMessage = "";

    if (value) {
      errorMessage = checkPasswordValidation(value);
    } else {
      errorMessage = "";
    }

    setFormInput(oldState => ({
      ...oldState,
      password: {
        ...oldState.password,
        value,
        errorMessage: errorMessage || "",
      },
    }));
  }, []);

  const handleShowModalForm = useCallback(
    id => {
      setModalForm(oldState => ({
        ...oldState,
        isOpen: true,
        title: id === undefined ? "Tambah Akun" : "Edit Akun",
        isLoading: id === undefined ? false : true,
      }));

      if (id) {
        handleGetDetailAccount(id);
      }
    },
    [handleGetDetailAccount]
  );

  const handleCloseModalForm = useCallback(() => {
    setModalForm(oldState => ({
      ...oldState,
      isOpen: false,
      title: "",
      isLoading: false,
    }));
    setFormInput({
      name: {
        value: "",
        errorMessage: "",
      },
      username: {
        value: "",
        errorMessage: "",
      },
      email: {
        value: "",
        errorMessage: "",
      },
      password: {
        value: "",
        errorMessage: "",
      },
    });
    setAccountId("");
  }, []);

  const handleShowModalConfirm = useCallback(accountId => {
    setAccountId(accountId);
    setModalConfirm(oldState => ({
      ...oldState,
      isOpen: true,
      title: "Konfirmasi",
      description: "Apakah anda ingin menghapus data ini ?",
    }));
  }, []);

  const handleCloseModalConfirm = useCallback(() => {
    setAccountId("");
    setModalConfirm(oldState => ({
      ...oldState,
      isOpen: false,
      title: "",
      description: "",
      isLoading: false,
    }));
  }, []);

  const handleCreateAccount = useCallback(
    payload => {
      ApiCreateAccount(payload).then(response => {
        if (response.status === 201) {
          handleCloseModalForm();
          handleGetApiAccount();
          setIsLoading(true);
          handleShowToast("Data berhasil ditambahkan", "Tambah Data");
        }

        if (response.status === 400) {
          if (response.result.name === "name") {
            setFormInput(oldState => ({
              ...oldState,
              name: {
                ...oldState.name,
                errorMessage: response.message,
              },
            }));
          }

          if (response.result.name === "username") {
            setFormInput(oldState => ({
              ...oldState,
              username: {
                ...oldState.username,
                errorMessage: response.message,
              },
            }));
          }

          if (response.result.name === "email") {
            setFormInput(oldState => ({
              ...oldState,
              email: {
                ...oldState.email,
                errorMessage: response.message,
              },
            }));
          }

          if (response.result.name === "password") {
            setFormInput(oldState => ({
              ...oldState,
              password: {
                ...oldState.password,
                errorMessage: response.message,
              },
            }));
          }
        }

        setModalForm(oldState => ({
          ...oldState,
          isLoading: false,
        }));
      });
    },
    [handleGetApiAccount, handleCloseModalForm]
  );

  const handleUpdateAccount = useCallback(
    (accountId, paylaod) => {
      ApiUpdateAccount(accountId, paylaod).then(response => {
        if (response.status === 201) {
          handleCloseModalForm();
          setIsLoading(true);
          handleGetApiAccount();
          handleShowToast("Data berhasil diedit", "Edit Data");
        }

        if (response.status === 400) {
          setModalForm(oldState => ({
            ...oldState,
            isLoading: false,
          }));
          if (response.result.name === "name") {
            setFormInput(oldState => ({
              ...oldState,
              name: {
                ...oldState.name,
                errorMessage: response.message,
              },
            }));
          }

          if (response.result.name === "username") {
            setFormInput(oldState => ({
              ...oldState,
              username: {
                ...oldState.username,
                errorMessage: response.message,
              },
            }));
          }

          if (response.result.name === "email") {
            setFormInput(oldState => ({
              ...oldState,
              email: {
                ...oldState.email,
                errorMessage: response.message,
              },
            }));
          }

          if (response.result.name === "password") {
            setFormInput(oldState => ({
              ...oldState,
              password: {
                ...oldState.password,
                errorMessage: response.message,
              },
            }));
          }
        }
      });
    },
    [handleGetApiAccount, handleCloseModalForm]
  );

  const handleDeleteAccount = useCallback(() => {
    setModalConfirm(oldState => ({
      ...oldState,
      isLoading: true,
    }));
    ApiDeleteAccount(accountId).then(response => {
      if (response.status === 200) {
        handleCloseModalConfirm();
        handleGetApiAccount();
        handleShowToast("Data berhasil dihapus", "Hapus Data");
      }
    });
  }, [
    accountId,
    handleCloseModalConfirm,
    handleGetApiAccount,
    handleShowToast,
  ]);

  const handleSaveCollections = useCallback(() => {
    const payload = {
      name: formInput.name.value,
      username: formInput.username.value,
      email: formInput.email.value,
      password: formInput.password.value,
    };
    if (payload.name === "") {
      setFormInput(oldState => ({
        ...oldState,
        name: {
          ...oldState.name,
          errorMessage: "Nama wajib diisi",
        },
      }));
      return;
    }

    if (payload.username === "") {
      setFormInput(oldState => ({
        ...oldState,
        username: {
          ...oldState.username,
          errorMessage: "Username wajib diisi",
        },
      }));
      return;
    }

    if (payload.email === "") {
      setFormInput(oldState => ({
        ...oldState,
        email: {
          ...oldState.email,
          errorMessage: "Email wajib diisi",
        },
      }));
      return;
    }

    if (!accountId) {
      if (payload.password === "") {
        setFormInput(oldState => ({
          ...oldState,
          password: {
            ...oldState.password,
            errorMessage: "Password wajib diisi",
          },
        }));
        return;
      }
    }

    if (!formInput.password.errorMessage) {
      setModalForm(oldState => ({
        ...oldState,
        isLoading: true,
      }));
      if (accountId) {
        handleUpdateAccount(accountId, payload);
      } else {
        handleCreateAccount(payload);
      }
    }
  }, [accountId, formInput, handleCreateAccount, handleUpdateAccount]);

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title={"Akun"} breadcrumbItem={"Akun"} />
        <Row>
          <Col md="12">
            <Card>
              <CardBody>
                <Row className="mb-4">
                  <Col md="12" className="d-flex justify-content-between">
                    <Col md="2">
                      <CardTitle
                        style={{
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        Data Akun
                      </CardTitle>
                    </Col>

                    <Button
                      color="primary"
                      onClick={() => handleShowModalForm()}
                    >
                      <i className="bx bx-plus font-size-16 align-middle me-2" />
                      Tambah Akun
                    </Button>
                  </Col>
                </Row>

                <Row>
                  <Col md="12">
                    <Table className="text-center align-middle table-nowrap">
                      <thead>
                        <tr>
                          <th className="col-1">No</th>
                          <th>Nama</th>
                          <th>Username</th>
                          <th>Email</th>
                          <th className="col-2">Aksi</th>
                        </tr>
                      </thead>

                      {accountData.length > 0 && (
                        <tbody>
                          {accountData.map((data, index) => {
                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{data.name}</td>
                                <td>{data.username}</td>
                                <td>{data.email}</td>
                                <td className="d-flex gap-3 justify-content-center">
                                  {/* <Button color="outline-secondary">
                                    <i className="bx bx-show font-size-16 align-middle me-2" />
                                    Lihat
                                  </Button> */}
                                  <Button
                                    color="outline-secondary"
                                    onClick={() =>
                                      handleShowModalForm(data.accountId)
                                    }
                                  >
                                    <i className="bx bx-edit font-size-16 align-middle me-2" />
                                    Edit
                                  </Button>
                                  <Button
                                    color="outline-secondary"
                                    onClick={() =>
                                      handleShowModalConfirm(data.accountId)
                                    }
                                  >
                                    <i className="bx bx-trash font-size-16 align-middle me-2" />
                                    Hapus
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      )}
                    </Table>

                    {!isLoading && !accountData.length > 0 && (
                      <div className="d-flex justify-content-center pt-5 pb-5 text-danger">
                        Data Tidak Tersedia
                      </div>
                    )}

                    {isLoading && (
                      <div className="d-flex justify-content-center pt-5 pb-5 text-primary">
                        <Spinner />
                      </div>
                    )}
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal Form */}
      <Modal isOpen={modalForm.isOpen}>
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">
            {modalForm.title}
          </h5>
        </div>

        <div className="modal-body">
          <form>
            <div className="mb-3">
              <Label className="col-form-label">Name :</Label>
              <Input
                type="text"
                name="name"
                className="form-control"
                placeholder="nama"
                value={formInput.name.value}
                onChange={handleChangeInputName}
                invalid={formInput.name.errorMessage !== ""}
                disabled={modalForm.isLoading}
              />
              {formInput.name.errorMessage && (
                <FormFeedback type="invalid">
                  {formInput.name.errorMessage}
                </FormFeedback>
              )}
            </div>

            <div className="mb-3">
              <Label className="col-form-label">Username :</Label>
              <Input
                type="text"
                name="username"
                className="form-control"
                placeholder="username"
                value={formInput.username.value}
                onChange={handleChangeInputUsername}
                invalid={formInput.username.errorMessage !== ""}
                disabled={modalForm.isLoading}
              />
              {formInput.username.errorMessage && (
                <FormFeedback type="invalid">
                  {formInput.username.errorMessage}
                </FormFeedback>
              )}
            </div>

            <div className="mb-3">
              <Label className="col-form-label">Email :</Label>
              <Input
                type="text"
                name="email"
                className="form-control"
                placeholder="email"
                value={formInput.email.value}
                onChange={handleChangeInputEmail}
                invalid={formInput.email.errorMessage !== ""}
                disabled={modalForm.isLoading}
              />
              {formInput.email.errorMessage && (
                <FormFeedback type="invalid">
                  {formInput.email.errorMessage}
                </FormFeedback>
              )}
            </div>

            <div className="mb-3">
              <Label className="col-form-label">Password :</Label>
              <InputGroup>
                <Input
                  type={isShowPassword ? "text" : "password"}
                  name="password"
                  className="form-control"
                  placeholder="password"
                  value={formInput.password.value}
                  onChange={handleChangeInputPassword}
                  invalid={formInput.password.errorMessage !== ""}
                  disabled={modalForm.isLoading}
                />
                <div className="input-group-text">
                  <i
                    className={` ${
                      isShowPassword ? "bx bx-show" : "bx bx-hide"
                    }`}
                    onClick={e => {
                      e.preventDefault();
                      setIsShowPassword(oldState => !oldState);
                    }}
                    style={{
                      cursor: "pointer",
                    }}
                  />
                </div>
                {formInput.password.errorMessage && (
                  <FormFeedback type="invalid">
                    {formInput.password.errorMessage}
                  </FormFeedback>
                )}
              </InputGroup>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCloseModalForm}
            disabled={modalForm.isLoading}
          >
            Tutup
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSaveCollections}
            disabled={modalForm.isLoading}
          >
            Simpan
          </button>
        </div>
      </Modal>

      {/* Modal Confirm */}
      <Modal isOpen={modalConfirm.isOpen}>
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">
            {modalConfirm.title}
          </h5>
        </div>

        <div className="modal-body">
          <p className="card-title-desc">{modalConfirm.description}</p>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCloseModalConfirm}
            disabled={modalConfirm.isLoading}
          >
            Batal
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleDeleteAccount}
            disabled={modalConfirm.isLoading}
          >
            Ya, Hapus
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Index;
