import React, { useState, useEffect, Fragment, useCallback } from "react";
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
  CardImg,
} from "reactstrap";
import toastr from "toastr";
import {
  ApiGetTeamsLists,
  ApiCreateTeams,
  ApiGetDetailTeams,
  ApiUpdateTeams,
  ApiDeleteTeams,
} from "../../api/teams";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [teamsData, setTeamsData] = useState([]);
  const [modalForm, setModalForm] = useState({
    isOpen: false,
    title: "",
    isLoading: false,
  });
  const [teamsId, setTeamsId] = useState("");
  const [formInput, setFormInput] = useState({
    name: {
      value: "",
      errorMessage: "",
    },
    title: {
      value: "",
      errorMessage: "",
    },
    linkTwitter: {
      value: "",
      errorMessage: "",
    },
    linkLinkedin: {
      value: "",
      errorMessage: "",
    },
    description: {
      value: "",
      errorMessage: "",
    },
    photoProfile: {
      value: "",
      errorMessage: "",
    },
  });
  const [previewPhotoProfile, setPreviewPhotoProfile] = useState("");
  const [oldPhotoProfile, setOldPhotoProfile] = useState("");
  const [modalConfirm, setModalConfirm] = useState({
    isOpen: false,
    title: "",
    description: "",
    isLoading: false,
  });

  useEffect(() => {
    handleGetApiTeams();
  }, []);

  const handleGetApiTeams = useCallback(() => {
    ApiGetTeamsLists().then(response => {
      if (response.status === 200) {
        setTeamsData(response.result.data);
      }

      if (response.status === 204) {
        setTeamsData([]);
      }
      setIsLoading(false);
    });
  }, []);

  const handleGetDetailTeams = useCallback(id => {
    ApiGetDetailTeams(id).then(response => {
      if (response.status === 200) {
        setTeamsId(response.result.teamsId);
        setFormInput(oldState => ({
          ...oldState,
          name: {
            ...oldState.name,
            value: response.result.name,
          },
          title: {
            ...oldState.title,
            value: response.result.title,
          },
          linkTwitter: {
            ...oldState.linkTwitter,
            value: response.result.twitterLink,
          },
          linkLinkedin: {
            ...oldState.linkLinkedin,
            value: response.result.linkedinLink,
          },
          description: {
            ...oldState.description,
            value: response.result.description,
          },
        }));
        setOldPhotoProfile(response.result.pathPhoto);
        setPreviewPhotoProfile(response.result.pathPhoto);
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

  const handleChangeInputTwitter = useCallback(e => {
    const { value } = e.target;
    setFormInput(oldState => ({
      ...oldState,
      linkTwitter: {
        ...oldState.linkTwitter,
        value,
        errorMessage: "",
      },
    }));
  }, []);

  const handleChangeInputLinkedin = useCallback(e => {
    const { value } = e.target;
    setFormInput(oldState => ({
      ...oldState,
      linkLinkedin: {
        ...oldState.linkLinkedin,
        value,
        errorMessage: "",
      },
    }));
  }, []);

  const handleChangeInputDescription = useCallback(e => {
    const { value } = e.target;
    setFormInput(oldState => ({
      ...oldState,
      description: {
        ...oldState.description,
        value,
        errorMessage: "",
      },
    }));
  }, []);

  const handleChangeInputTitle = useCallback(e => {
    const value = e.target.value;
    setFormInput(oldState => ({
      ...oldState,
      title: {
        ...oldState.title,
        value,
        errorMessage: "",
      },
    }));
  }, []);

  const handleChangePhoto = useCallback(
    e => {
      const value = e.target.files[0];
      if (value) {
        setPreviewPhotoProfile(URL.createObjectURL(value));
        setFormInput(oldState => ({
          ...oldState,
          photoProfile: {
            ...oldState.photoProfile,
            value,
            errorMessage: "",
          },
        }));
      } else {
        if (teamsId) {
          setPreviewPhotoProfile(oldPhotoProfile);
        } else {
          setPreviewPhotoProfile("");
        }
        setFormInput(oldState => ({
          ...oldState,
          photoProfile: {
            ...oldState.photoProfile,
            value: "",
            errorMessage: "",
          },
        }));
      }
    },
    [teamsId, oldPhotoProfile]
  );

  const handleShowModalForm = useCallback(
    id => {
      setModalForm(oldState => ({
        ...oldState,
        isOpen: true,
        title: id === undefined ? "Tambah Tim" : "Edit Tim",
        isLoading: id === undefined ? false : true,
      }));

      if (id) {
        handleGetDetailTeams(id);
      }
    },
    [handleGetDetailTeams]
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
      title: {
        value: "",
        errorMessage: "",
      },
      linkTwitter: {
        value: "",
        errorMessage: "",
      },
      linkLinkedin: {
        value: "",
        errorMessage: "",
      },
      description: {
        value: "",
        errorMessage: "",
      },
      photoProfile: {
        value: "",
        errorMessage: "",
      },
    });
    setPreviewPhotoProfile("");
    setTeamsId("");
  }, []);

  const handleShowModalConfirm = useCallback(teamsId => {
    setTeamsId(teamsId);
    setModalConfirm(oldState => ({
      ...oldState,
      isOpen: true,
      title: "Konfirmasi",
      description: "Apakah anda ingin menghapus data ini ?",
    }));
  }, []);

  const handleCloseModalConfirm = useCallback(() => {
    setTeamsId("");
    setModalConfirm(oldState => ({
      ...oldState,
      isOpen: false,
      title: "",
      description: "",
      isLoading: false,
    }));
  }, []);

  const handleCreateTeams = useCallback(
    formData => {
      ApiCreateTeams(formData).then(response => {
        if (response.status === 201) {
          handleCloseModalForm();
          setIsLoading(true);
          handleGetApiTeams();
          handleShowToast("Data berhasil ditambahkan", "Tambah Data");
        }

        if (response.status === 400) {
          setModalForm(oldState => ({
            ...oldState,
            isLoading: false,
          }));
        }
      });
    },
    [handleGetApiTeams, handleCloseModalForm]
  );

  const handleUpdateTeams = useCallback(
    (teamsId, formData) => {
      ApiUpdateTeams(teamsId, formData).then(response => {
        if (response.status === 201) {
          handleCloseModalForm();
          setIsLoading(true);
          handleGetApiTeams();
          handleShowToast("Data berhasil diedit", "Edit Data");
        }

        if (response.status === 400) {
          setModalForm(oldState => ({
            ...oldState,
            isLoading: false,
          }));
        }
      });
    },
    [handleGetApiTeams, handleCloseModalForm]
  );

  const handleDeleteTeams = useCallback(() => {
    setModalConfirm(oldState => ({
      ...oldState,
      isLoading: true,
    }));
    ApiDeleteTeams(teamsId).then(response => {
      if (response.status === 200) {
        handleCloseModalConfirm();
        handleGetApiTeams();
        handleShowToast("Data berhasil dihapus", "Hapus Data");
      }
    });
  }, [teamsId, handleCloseModalConfirm, handleGetApiTeams, handleShowToast]);

  const handleSaveCollections = useCallback(() => {
    const payload = {
      name: formInput.name.value,
      title: formInput.title.value,
      twitterLink: formInput.linkTwitter.value,
      linkedinLink: formInput.linkLinkedin.value,
      description: formInput.description.value,
      photo: formInput.photoProfile.value,
    };
    if (payload.name === "") {
      setFormInput(oldState => ({
        ...oldState,
        name: {
          ...oldState.name,
          errorMessage: "Nama tim wajib diisi",
        },
      }));
      return;
    }

    if (payload.title === "") {
      setFormInput(oldState => ({
        ...oldState,
        title: {
          ...oldState.title,
          errorMessage: "Title wajib diisi",
        },
      }));
      return;
    }

    if (!teamsId) {
      if (payload.photo === "") {
        setFormInput(oldState => ({
          ...oldState,
          photoProfile: {
            ...oldState.photoProfile,
            errorMessage: "Foto porfil wajib diisi",
          },
        }));
        return;
      }
    }

    setModalForm(oldState => ({
      ...oldState,
      isLoading: true,
    }));

    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("title", payload.title);
    formData.append("twitterLink", payload.twitterLink);
    formData.append("linkedinLink", payload.linkedinLink);
    formData.append("description", payload.description);
    formData.append("photo", payload.photo);

    if (teamsId) {
      handleUpdateTeams(teamsId, formData);
    } else {
      handleCreateTeams(formData);
    }
  }, [teamsId, formInput, handleCreateTeams, handleUpdateTeams]);

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title={"Tim"} breadcrumbItem={"Tim"} />
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
                        Data Tim
                      </CardTitle>
                    </Col>

                    <Button
                      color="primary"
                      onClick={() => handleShowModalForm()}
                    >
                      <i className="bx bx-plus font-size-16 align-middle me-2" />
                      Tambah Tim
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
                          <th>Titel</th>
                          <th>Link Twitter</th>
                          <th>Link Linkedin</th>
                          <th className="col-2">Aksi</th>
                        </tr>
                      </thead>

                      {teamsData.length > 0 && (
                        <tbody>
                          {teamsData.map((data, index) => {
                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{data.name}</td>
                                <td>{data.title}</td>
                                <td>{data.twitterLink}</td>
                                <td>{data.linkedinLink}</td>
                                <td className="d-flex gap-3 justify-content-center">
                                  {/* <Button color="outline-secondary">
                                    <i className="bx bx-show font-size-16 align-middle me-2" />
                                    Lihat
                                  </Button> */}
                                  <Button
                                    color="outline-secondary"
                                    onClick={() =>
                                      handleShowModalForm(data.teamsId)
                                    }
                                  >
                                    <i className="bx bx-edit font-size-16 align-middle me-2" />
                                    Edit
                                  </Button>
                                  <Button
                                    color="outline-secondary"
                                    onClick={() =>
                                      handleShowModalConfirm(data.teamsId)
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

                    {!isLoading && !teamsData.length > 0 && (
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
                placeholder="nama tim"
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
              <Label className="d-block col-form-label">Title :</Label>

              <Input
                type="select"
                value={formInput.title.value}
                className="form-control"
                onChange={handleChangeInputTitle}
                invalid={formInput.title.errorMessage !== ""}
                disabled={modalForm.isLoading}
              >
                <option value="">Pilih Title</option>
                <option value="0">Artist</option>
                <option value="1">Project Manager</option>
                <option value="2">Community Manager</option>
                <option value="3">Developer</option>
              </Input>
              {formInput.title.errorMessage && (
                <FormFeedback type="invalid">
                  {formInput.title.errorMessage}
                </FormFeedback>
              )}

              {/* <Input
                  type="radio"
                  className="form-check-input"
                  value="0"
                  onChange={handleChangeInputTitle}
                  checked={formInput.title.value === "0"}
                  invalid={formInput.title.errorMessage !== ""}
                  disabled={modalForm.isLoading}
                />
                <Label
                  className="form-check-label"
                  style={{
                    marginRight: 10,
                    marginLeft: 4,
                  }}
                >
                  Artist
                </Label>

                <Input
                  type="radio"
                  className="form-check-input"
                  value="1"
                  onChange={handleChangeInputTitle}
                  checked={formInput.title.value === "1"}
                  invalid={formInput.title.errorMessage !== ""}
                  disabled={modalForm.isLoading}
                />
                <Label
                  className="form-check-label"
                  style={{
                    marginRight: 10,
                    marginLeft: 4,
                  }}
                >
                  Project Manager
                </Label>

                <Input
                  type="radio"
                  className="form-check-input"
                  value="2"
                  onChange={handleChangeInputTitle}
                  checked={formInput.title.value === "2"}
                  invalid={formInput.title.errorMessage !== ""}
                  disabled={modalForm.isLoading}
                />
                <Label
                  className="form-check-label"
                  style={{
                    marginRight: 10,
                    marginLeft: 4,
                  }}
                >
                  Community Manager
                </Label>

                <Input
                  type="radio"
                  className="form-check-input"
                  value="3"
                  onChange={handleChangeInputTitle}
                  checked={formInput.title.value === "3"}
                  invalid={formInput.title.errorMessage !== ""}
                  disabled={modalForm.isLoading}
                />
                <Label
                  className="form-check-label"
                  style={{
                    marginRight: 10,
                    marginLeft: 4,
                  }}
                >
                  Developer
                </Label>
                */}
            </div>

            <div className="mb-3">
              <Label className="col-form-label">Link Twitter :</Label>
              <Input
                type="text"
                name="linkTwitter"
                className="form-control"
                placeholder="link twitter"
                value={formInput.linkTwitter.value}
                onChange={handleChangeInputTwitter}
                invalid={formInput.linkTwitter.errorMessage !== ""}
                disabled={modalForm.isLoading}
              />
              {formInput.linkTwitter.errorMessage && (
                <FormFeedback type="invalid">
                  {formInput.linkTwitter.errorMessage}
                </FormFeedback>
              )}
            </div>

            <div className="mb-3">
              <Label className="col-form-label">Link Linkedin :</Label>
              <Input
                type="text"
                name="linkLinkedin"
                className="form-control"
                placeholder="link linkedin"
                value={formInput.linkLinkedin.value}
                onChange={handleChangeInputLinkedin}
                invalid={formInput.linkLinkedin.errorMessage !== ""}
                disabled={modalForm.isLoading}
              />
              {formInput.linkLinkedin.errorMessage && (
                <FormFeedback type="invalid">
                  {formInput.linkLinkedin.errorMessage}
                </FormFeedback>
              )}
            </div>

            <div className="mb-3">
              <Label className="col-form-label">Deskripsi :</Label>
              <Input
                type="textarea"
                name="description"
                className="form-control"
                placeholder="deskripsi"
                rows="5"
                value={formInput.description.value}
                onChange={handleChangeInputDescription}
                invalid={formInput.description.errorMessage !== ""}
                disabled={modalForm.isLoading}
              />
              {formInput.description.errorMessage && (
                <FormFeedback type="invalid">
                  {formInput.description.errorMessage}
                </FormFeedback>
              )}
            </div>

            <div className="mb-3">
              <Label className="col-form-label">Foto Profil :</Label>

              {previewPhotoProfile !== "" && (
                <div className="mb-3">
                  <div
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: "50%",
                    }}
                  >
                    <CardImg
                      src={previewPhotoProfile}
                      width="100%"
                      height="100%"
                      style={{
                        borderRadius: "50%",
                      }}
                    />
                  </div>
                </div>
              )}

              <Input
                type="file"
                name="photoProfile"
                className="form-control"
                onChange={handleChangePhoto}
                accept="image/*"
                invalid={formInput.photoProfile.errorMessage !== ""}
                disabled={modalForm.isLoading}
              />
              {formInput.photoProfile.errorMessage && (
                <FormFeedback type="invalid">
                  {formInput.photoProfile.errorMessage}
                </FormFeedback>
              )}
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
            onClick={handleDeleteTeams}
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
