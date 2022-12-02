import React, { Fragment, useCallback, useEffect, useState } from "react";
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
  FormFeedback,
  Input,
  CardImg,
} from "reactstrap";
import toastr from "toastr";
import {
  ApiGetCollectionsLists,
  ApiGetDetailCollectionsLists,
  ApiCreateCollections,
  ApiUpdateCollections,
  ApiDeleteCollections,
} from "../../api/collections";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [collectionsData, setCollectionsData] = useState([]);
  const [modalForm, setModalForm] = useState({
    isOpen: false,
    title: "",
    isLoading: false,
  });
  const [modalConfirm, setModalConfirm] = useState({
    isOpen: false,
    title: "",
    description: "",
    isLoading: false,
  });
  const [collectionsId, setCollectionsId] = useState("");
  const [formInput, setFormInput] = useState({
    collections: {
      value: "",
      errorMessage: "",
    },
    urlLink: {
      value: "",
      errorMessage: "",
    },
    image: {
      value: "",
      errorMessage: "",
    },
  });
  const [previewImage, setPreviewImage] = useState("");
  const [oldImage, setOldImage] = useState("");

  useEffect(() => {
    handleGetApiCollections();
  }, []);

  const handleShowToast = useCallback((message, title) => {
    toastr.options.closeButton = true;
    toastr.options.positionClass = "toast-top-center";
    toastr.options.closeMethod = "fadeOut";
    toastr.options.closeDuration = 300;
    toastr.options.closeEasing = "swing";
    toastr.success(message, title);
  }, []);

  const handleGetApiCollections = useCallback(() => {
    ApiGetCollectionsLists().then(response => {
      if (response.status === 200) {
        setCollectionsData(response.result.data);
      }

      if (response.status === 204) {
        setCollectionsData([]);
      }
      setIsLoading(false);
    });
  }, []);

  const handleGetDetailCollections = useCallback(id => {
    ApiGetDetailCollectionsLists(id).then(response => {
      if (response.status === 200) {
        setCollectionsId(response.result.collectionsId);
        setFormInput(oldState => ({
          ...oldState,
          collections: {
            ...oldState.collections,
            value: response.result.name,
          },
          urlLink: {
            ...oldState.urlLink,
            value: response.result.urlLink,
          },
        }));
        setOldImage(response.result.pathImage);
        setPreviewImage(response.result.pathImage);
        setModalForm(oldState => ({
          ...oldState,
          isLoading: false,
        }));
      }
    });
  }, []);

  const handleShowModalForm = useCallback(
    id => {
      setModalForm(oldState => ({
        ...oldState,
        isOpen: true,
        title: id === undefined ? "Tambah Koleksi" : "Edit Koleksi",
        isLoading: id === undefined ? false : true,
      }));

      if (id) {
        handleGetDetailCollections(id);
      }
    },
    [handleGetDetailCollections]
  );

  const handleCloseModalForm = useCallback(() => {
    setModalForm(oldState => ({
      ...oldState,
      isOpen: false,
      title: "",
      isLoading: false,
    }));

    setCollectionsId("");
    setPreviewImage("");
    setFormInput(oldState => ({
      ...oldState,
      collections: {
        ...oldState.collections,
        value: "",
        errorMessage: "",
      },
      urlLink: {
        ...oldState.urlLink,
        value: "",
        errorMessage: "",
      },
      image: {
        ...oldState.image,
        value: "",
        errorMessage: "",
      },
    }));
  }, []);

  const handleShowModalConfirm = useCallback(collectionsId => {
    setCollectionsId(collectionsId);
    setModalConfirm(oldState => ({
      ...oldState,
      isOpen: true,
      title: "Konfirmasi",
      description: "Apakah anda ingin menghapus data ini ?",
    }));
  }, []);

  const handleCloseModalConfirm = useCallback(() => {
    setCollectionsId("");
    setModalConfirm(oldState => ({
      ...oldState,
      isOpen: false,
      title: "",
      description: "",
      isLoading: false,
    }));
  }, []);

  const handleChangeInputCollections = useCallback(e => {
    const value = e.target.value;
    setFormInput(oldState => ({
      ...oldState,
      collections: {
        ...oldState.collections,
        value: value,
        errorMessage: "",
      },
    }));
  }, []);

  const handleChangeInputUrlLink = useCallback(e => {
    const value = e.target.value;
    setFormInput(oldState => ({
      ...oldState,
      urlLink: {
        ...oldState.urlLink,
        value: value,
        errorMessage: "",
      },
    }));
  }, []);

  const handleChangePhoto = useCallback(
    e => {
      const value = e.target.files[0];
      if (value) {
        setPreviewImage(URL.createObjectURL(value));
        setFormInput(oldState => ({
          ...oldState,
          image: {
            ...oldState.image,
            value,
            errorMessage: "",
          },
        }));
      } else {
        if (collectionsId) {
          setPreviewImage(oldImage);
        } else {
          setPreviewImage("");
        }
        setFormInput(oldState => ({
          ...oldState,
          image: {
            ...oldState.image,
            value: "",
            errorMessage: "",
          },
        }));
      }
    },
    [collectionsId, oldImage]
  );

  const handleCreateCollections = useCallback(
    formData => {
      ApiCreateCollections(formData).then(response => {
        if (response.status === 201) {
          handleCloseModalForm();
          setIsLoading(true);
          handleGetApiCollections();
          handleShowToast("Data berhasil ditambahkan", "Tambah Data");
        }

        if (response.status === 400) {
          setModalForm(oldState => ({
            ...oldState,
            isLoading: false,
          }));
          if (response.result.name === "name") {
            setFormInput(oldState => ({
              ...oldState,
              collections: {
                ...oldState.collections,
                errorMessage: response.message,
              },
            }));
          }
        }
      });
    },
    [handleCloseModalForm, handleGetApiCollections]
  );

  const handleUpdateCollections = useCallback(
    (collectionsId, formData) => {
      ApiUpdateCollections(collectionsId, formData).then(response => {
        if (response.status === 201) {
          handleCloseModalForm();
          setIsLoading(true);
          handleGetApiCollections();
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
              collections: {
                ...oldState.collections,
                errorMessage: response.message,
              },
            }));
          }
        }
      });
    },
    [handleCloseModalForm, handleGetApiCollections]
  );

  const handleDeleteCollections = useCallback(() => {
    setModalConfirm(oldState => ({
      ...oldState,
      isLoading: true,
    }));
    ApiDeleteCollections(collectionsId).then(response => {
      if (response.status === 200) {
        handleCloseModalConfirm();
        handleGetApiCollections();
        handleShowToast("Data berhasil dihapus", "Hapus Data");
      }
    });
  }, [
    collectionsId,
    handleCloseModalConfirm,
    handleGetApiCollections,
    handleShowToast,
  ]);

  const handleSaveCollections = useCallback(() => {
    if (formInput.collections.value === "") {
      setFormInput(oldState => ({
        ...oldState,
        collections: {
          ...oldState.collections,
          errorMessage: "Nama koleksi wajib diisi",
        },
      }));
    } else if (formInput.urlLink.value === "") {
      setFormInput(oldState => ({
        ...oldState,
        urlLink: {
          ...oldState.urlLink,
          errorMessage: "Link url wajib diisi",
        },
      }));
    } else if (formInput.image.value === "" && !collectionsId) {
      setFormInput(oldState => ({
        ...oldState,
        image: {
          ...oldState.image,
          errorMessage: "Gambar wajib diisi",
        },
      }));
    } else {
      setModalForm(oldState => ({
        ...oldState,
        isLoading: true,
      }));
      const formData = new FormData();
      formData.append("name", formInput.collections.value);
      formData.append("urlLink", formInput.urlLink.value);
      formData.append("image", formInput.image.value);
      if (collectionsId) {
        handleUpdateCollections(collectionsId, formData);
      } else {
        handleCreateCollections(formData);
      }
    }
  }, [collectionsId, formInput]);

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title={"Koleksi"} breadcrumbItem={"Koleksi"} />
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
                        Data Koleksi
                      </CardTitle>
                    </Col>

                    <Button
                      color="primary"
                      onClick={() => handleShowModalForm()}
                    >
                      <i className="bx bx-plus font-size-16 align-middle me-2" />
                      Tambah Koleksi
                    </Button>
                  </Col>
                </Row>

                <Row>
                  <Col md="12">
                    <Table className="text-center align-middle table-nowrap">
                      <thead>
                        <tr>
                          <th className="col-1">No</th>
                          <th>Nama Koleksi</th>
                          <th className="col-3">Aksi</th>
                        </tr>
                      </thead>

                      {!isLoading && collectionsData.length > 0 && (
                        <tbody>
                          {collectionsData.map((data, index) => {
                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{data.name}</td>
                                <td className="d-flex gap-3 justify-content-center">
                                  {/* <Button color="outline-secondary">
                                    <i className="bx bx-show font-size-16 align-middle me-2" />
                                    Lihat
                                  </Button> */}
                                  <Button
                                    color="outline-secondary"
                                    onClick={() =>
                                      handleShowModalForm(data.collectionsId)
                                    }
                                  >
                                    <i className="bx bx-edit font-size-16 align-middle me-2" />
                                    Edit
                                  </Button>
                                  <Button
                                    color="outline-secondary"
                                    onClick={() => {
                                      handleShowModalConfirm(
                                        data.collectionsId
                                      );
                                    }}
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

                    {!isLoading && !collectionsData.length > 0 && (
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
              <label htmlFor="recipient-name" className="col-form-label">
                Nama :
              </label>
              <Input
                type="text"
                className="form-control"
                placeholder="nama koleksi"
                value={formInput.collections.value}
                onChange={handleChangeInputCollections}
                invalid={formInput.collections.errorMessage !== ""}
                disabled={modalForm.isLoading}
              />
              {formInput.collections.errorMessage && (
                <FormFeedback type="invalid">
                  {formInput.collections.errorMessage}
                </FormFeedback>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="recipient-name" className="col-form-label">
                Link URL :
              </label>
              <Input
                type="text"
                className="form-control"
                placeholder="nama koleksi"
                value={formInput.urlLink.value}
                onChange={handleChangeInputUrlLink}
                invalid={formInput.urlLink.errorMessage !== ""}
                disabled={modalForm.isLoading}
              />
              {formInput.urlLink.errorMessage && (
                <FormFeedback type="invalid">
                  {formInput.urlLink.errorMessage}
                </FormFeedback>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="recipient-name" className="col-form-label">
                Gambar :
              </label>

              {previewImage !== "" && (
                <div className="mb-3">
                  <div
                    style={{
                      width: 250,
                      height: 150,
                      borderRadius: "50%",
                    }}
                  >
                    <CardImg src={previewImage} width="100%" height="100%" />
                  </div>
                </div>
              )}

              <Input
                type="file"
                name="photoProfile"
                className="form-control"
                onChange={handleChangePhoto}
                accept="image/*"
                invalid={formInput.image.errorMessage !== ""}
                disabled={modalForm.isLoading}
              />
              {formInput.image.errorMessage && (
                <FormFeedback type="invalid">
                  {formInput.image.errorMessage}
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
            onClick={handleDeleteCollections}
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
