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
  ApiGetDonationsLists,
  ApiCreateDonations,
  ApiGetDetailDonations,
  ApiUpdateDonations,
  ApiDeleteDonations,
} from "../../api/donations";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [donationsData, setDonationsData] = useState([]);
  const [modalForm, setModalForm] = useState({
    isOpen: false,
    title: "",
    isLoading: false,
  });
  const [donationsId, setDonationsId] = useState("");
  const [formInput, setFormInput] = useState({
    title: {
      value: "",
      errorMessage: "",
    },
    photoSertificate: {
      value: "",
      errorMessage: "",
    },
    photoGlodie: {
      value: "",
      errorMessage: "",
    },
  });
  const [previewPhotoSertificate, setPreviewPhotoSertificate] = useState("");
  const [previewPhotoGlodie, setPreviewPhotoGlodie] = useState("");
  const [oldPhotoSertificate, setOldPhotoSertificate] = useState("");
  const [oldPhotoGlodie, setOldPhotoGlodie] = useState("");
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
    ApiGetDonationsLists().then(response => {
      if (response.status === 200) {
        setDonationsData(response.result.data);
      }

      if (response.status === 204) {
        setDonationsData([]);
      }
      setIsLoading(false);
    });
  }, []);

  const handleGetDetailTeams = useCallback(id => {
    ApiGetDetailDonations(id).then(response => {
      if (response.status === 200) {
        setDonationsId(response.result.donationsId);
        setFormInput(oldState => ({
          ...oldState,
          title: {
            ...oldState.title,
            value: response.result.title,
          },
        }));
        setOldPhotoSertificate(response.result.sertificateImagePath);
        setPreviewPhotoSertificate(response.result.sertificateImagePath);

        setOldPhotoGlodie(response.result.glodieImagePath);
        setPreviewPhotoGlodie(response.result.glodieImagePath);

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

  const handleChangeInputTitle = useCallback(e => {
    const { value } = e.target;
    setFormInput(oldState => ({
      ...oldState,
      title: {
        ...oldState.title,
        value,
        errorMessage: "",
      },
    }));
  }, []);

  const handleChangePhotoSertificate = useCallback(
    e => {
      const value = e.target.files[0];
      if (value) {
        setPreviewPhotoSertificate(URL.createObjectURL(value));
        setFormInput(oldState => ({
          ...oldState,
          photoSertificate: {
            ...oldState.photoSertificate,
            value,
            errorMessage: "",
          },
        }));
      } else {
        if (donationsId) {
          setPreviewPhotoSertificate(oldPhotoSertificate);
        } else {
          setPreviewPhotoSertificate("");
        }
        setFormInput(oldState => ({
          ...oldState,
          photoSertificate: {
            ...oldState.photoSertificate,
            value: "",
            errorMessage: "",
          },
        }));
      }
    },
    [donationsId, oldPhotoSertificate]
  );

  const handleChangePhotoGlodie = useCallback(
    e => {
      const value = e.target.files[0];
      if (value) {
        setPreviewPhotoGlodie(URL.createObjectURL(value));
        setFormInput(oldState => ({
          ...oldState,
          photoGlodie: {
            ...oldState.photoGlodie,
            value,
            errorMessage: "",
          },
        }));
      } else {
        if (donationsId) {
          setPreviewPhotoGlodie(oldPhotoGlodie);
        } else {
          setPreviewPhotoGlodie("");
        }
        setFormInput(oldState => ({
          ...oldState,
          photoGlodie: {
            ...oldState.photoGlodie,
            value: "",
            errorMessage: "",
          },
        }));
      }
    },
    [donationsId, oldPhotoGlodie]
  );

  const handleShowModalForm = useCallback(
    id => {
      setModalForm(oldState => ({
        ...oldState,
        isOpen: true,
        title: id === undefined ? "Tambah Donations" : "Edit Donations",
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
      title: {
        value: "",
        errorMessage: "",
      },
      photoSertificate: {
        value: "",
        errorMessage: "",
      },
      photoGlodie: {
        value: "",
        errorMessage: "",
      },
    });
    setPreviewPhotoSertificate("");
    setPreviewPhotoGlodie("");
    setDonationsId("");
  }, []);

  const handleShowModalConfirm = useCallback(donationsId => {
    setDonationsId(donationsId);
    setModalConfirm(oldState => ({
      ...oldState,
      isOpen: true,
      title: "Konfirmasi",
      description: "Apakah anda ingin menghapus data ini ?",
    }));
  }, []);

  const handleCloseModalConfirm = useCallback(() => {
    setDonationsId("");
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
      ApiCreateDonations(formData).then(response => {
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
    (donationsId, formData) => {
      ApiUpdateDonations(donationsId, formData).then(response => {
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
    ApiDeleteDonations(donationsId).then(response => {
      if (response.status === 200) {
        handleCloseModalConfirm();
        handleGetApiTeams();
        handleShowToast("Data berhasil dihapus", "Hapus Data");
      }
    });
  }, [
    donationsId,
    handleCloseModalConfirm,
    handleGetApiTeams,
    handleShowToast,
  ]);

  const handleSaveCollections = useCallback(() => {
    const payload = {
      title: formInput.title.value,
      photoSertificate: formInput.photoSertificate.value,
      photoGlodie: formInput.photoGlodie.value,
    };

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

    if (!donationsId) {
      if (payload.photoSertificate === "") {
        setFormInput(oldState => ({
          ...oldState,
          photoSertificate: {
            ...oldState.photoSertificate,
            errorMessage: "Gambar Sertifikat wajib diisi",
          },
        }));
        return;
      }
    }

    if (!donationsId) {
      if (payload.photoGlodie === "") {
        setFormInput(oldState => ({
          ...oldState,
          photoGlodie: {
            ...oldState.photoGlodie,
            errorMessage: "Gambar Glodie wajib diisi",
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
    formData.append("title", payload.title);
    formData.append("sertificateImage", payload.photoSertificate);
    formData.append("glodieImage", payload.photoGlodie);

    if (donationsId) {
      handleUpdateTeams(donationsId, formData);
    } else {
      handleCreateTeams(formData);
    }
  }, [donationsId, formInput, handleCreateTeams, handleUpdateTeams]);

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title={"Donais"} breadcrumbItem={"Donasi"} />
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
                        Data Donasi
                      </CardTitle>
                    </Col>

                    <Button
                      color="primary"
                      onClick={() => handleShowModalForm()}
                    >
                      <i className="bx bx-plus font-size-16 align-middle me-2" />
                      Tambah Donasi
                    </Button>
                  </Col>
                </Row>

                <Row>
                  <Col md="12">
                    <Table className="text-center align-middle table-nowrap">
                      <thead>
                        <tr>
                          <th className="col-1">No</th>
                          <th>Judul</th>
                          <th>Sertifikat</th>
                          <th>Glodie</th>
                          <th className="col-1">Aksi</th>
                        </tr>
                      </thead>

                      {donationsData.length > 0 && (
                        <tbody>
                          {donationsData.map((data, index) => {
                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{data.title}</td>
                                <td>
                                  <img
                                    src={data.sertificateImagePath}
                                    height="150px"
                                  />
                                </td>
                                <td>
                                  <img
                                    src={data.glodieImagePath}
                                    height="150px"
                                  />
                                </td>
                                <td>
                                  <div className="d-flex gap-3 justify-content-center">
                                    <Button
                                      color="outline-secondary"
                                      onClick={() =>
                                        handleShowModalForm(data.donationsId)
                                      }
                                    >
                                      <i className="bx bx-edit font-size-16 align-middle me-2" />
                                      Edit
                                    </Button>
                                    <Button
                                      color="outline-secondary"
                                      onClick={() =>
                                        handleShowModalConfirm(data.donationsId)
                                      }
                                    >
                                      <i className="bx bx-trash font-size-16 align-middle me-2" />
                                      Hapus
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      )}
                    </Table>

                    {!isLoading && !donationsData.length > 0 && (
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
              <Label className="col-form-label">Judul :</Label>
              <Input
                type="text"
                name="name"
                className="form-control"
                placeholder="judul"
                value={formInput.title.value}
                onChange={handleChangeInputTitle}
                invalid={formInput.title.errorMessage !== ""}
                disabled={modalForm.isLoading}
              />
              {formInput.title.errorMessage && (
                <FormFeedback type="invalid">
                  {formInput.title.errorMessage}
                </FormFeedback>
              )}
            </div>

            <div className="mb-3">
              <Label className="col-form-label">Gambar Sertifikat :</Label>

              {previewPhotoSertificate !== "" && (
                <div className="mb-3">
                  <div
                    style={{
                      width: '100%',
                      height: 350,
                    }}
                  >
                    <CardImg
                      src={previewPhotoSertificate}
                      width="100%"
                      height="100%"
                    />
                  </div>
                </div>
              )}

              <Input
                type="file"
                name="photoSertificate"
                className="form-control"
                onChange={handleChangePhotoSertificate}
                accept="image/*"
                invalid={formInput.photoSertificate.errorMessage !== ""}
                disabled={modalForm.isLoading}
              />
              {formInput.photoSertificate.errorMessage && (
                <FormFeedback type="invalid">
                  {formInput.photoSertificate.errorMessage}
                </FormFeedback>
              )}
            </div>

            <div className="mb-3">
              <Label className="col-form-label">Gambar Glodie :</Label>

              {previewPhotoGlodie !== "" && (
                <div className="mb-3">
                  <div
                    style={{
                      width: 350,
                      height: 350,
                    }}
                  >
                    <CardImg
                      src={previewPhotoGlodie}
                      width="100%"
                      height="100%"
                    />
                  </div>
                </div>
              )}

              <Input
                type="file"
                name="photoGlodie"
                className="form-control"
                onChange={handleChangePhotoGlodie}
                accept="image/*"
                invalid={formInput.photoGlodie.errorMessage !== ""}
                disabled={modalForm.isLoading}
              />
              {formInput.photoGlodie.errorMessage && (
                <FormFeedback type="invalid">
                  {formInput.photoGlodie.errorMessage}
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
