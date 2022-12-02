import React, { useState, useEffect, useCallback } from "react";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Form,
  Label,
  Input,
  Button,
  FormFeedback,
  CardImg,
} from "reactstrap";
import toastr from "toastr";
import {
  ApiGetContentWebsite,
  ApiCreateContentWebsite,
  ApiUpdateContentWebsite,
} from "../../../api/websiteContent";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [params, setParams] = useState("");
  const [formInput, setFormInput] = useState({
    bannerTitle: {
      value: "",
      errorMessage: "",
    },
    bannerDescription: {
      value: "",
      errorMessage: "",
    },
    bannerImage: {
      value: "",
      errorMessage: "",
    },
    aboutTitle: {
      value: "",
      errorMessage: "",
    },
    aboutDescription: {
      value: "",
      errorMessage: "",
    },
    aboutImage: {
      value: "",
      errorMessage: "",
    },
  });
  const [previewImageBanner, setPreviewImageBanner] = useState("");
  const [previewImageAbout, setPreviewImageAbout] = useState("");
  const [oldImageBanner, setOldImageBanner] = useState("");
  const [oldAboutBanner, setOldAboutBanner] = useState("");

  useEffect(() => {
    handleGetContentWebsite();
  }, []);

  const handleGetContentWebsite = useCallback(() => {
    ApiGetContentWebsite("home").then(response => {
      const regex = /[^"']+\.(?:(?:pn|jpe?)g|gif)\b/;

      const newObj = {
        bannerTitle: {
          value: "",
          errorMessage: "",
        },
        bannerDescription: {
          value: "",
          errorMessage: "",
        },
        bannerImage: {
          value: "",
          errorMessage: "",
        },
        aboutTitle: {
          value: "",
          errorMessage: "",
        },
        aboutDescription: {
          value: "",
          errorMessage: "",
        },
        aboutImage: {
          value: "",
          errorMessage: "",
        },
      };
      if (response.status === 200) {
        for (let i = 0; i < response.result.length; i++) {
          if (regex.test(response.result[i].value)) {
            newObj[response.result[i].keyName].value = "";
            newObj[response.result[i].keyName].websiteContentId =
              response.result[i].websiteContentId;

            if (response.result[i].keyName === "bannerImage") {
              setOldImageBanner(response.result[i].value);
              setPreviewImageBanner(response.result[i].value);
            }

            if (response.result[i].keyName === "aboutImage") {
              setOldAboutBanner(response.result[i].value);
              setPreviewImageAbout(response.result[i].value);
            }
          } else {
            newObj[response.result[i].keyName].value = response.result[i].value;
            newObj[response.result[i].keyName].websiteContentId =
              response.result[i].websiteContentId;
          }
        }
        setFormInput(newObj);
        setParams("update");
      }
      if (response.status === 204) {
        setParams("create");
      }

      setIsLoading(false);
    });
  }, []);

  const handleChangeInput = useCallback(e => {
    const { name, value } = e.target;
    setFormInput(oldState => ({
      ...oldState,
      [name]: {
        ...oldState[name],
        value,
        errorMessage: "",
      },
    }));
  }, []);

  const handleChangeImage = useCallback(
    e => {
      const { name, files } = e.target;
      const value = files[0];

      if (value) {
        if (name === "bannerImage") {
          setPreviewImageBanner(URL.createObjectURL(value));
        } else if (name === "aboutImage") {
          setPreviewImageAbout(URL.createObjectURL(value));
        }

        setFormInput(oldState => ({
          ...oldState,
          [name]: {
            ...oldState[name],
            value,
            errorMessage: "",
          },
        }));
      } else {
        if (params === "create") {
          if (name === "bannerImage") {
            setPreviewImageBanner("");
          }

          if (name === "aboutImage") {
            setPreviewImageAbout("");
          }
        } else if (params === "update") {
          if (name === "bannerImage") {
            setPreviewImageBanner(oldImageBanner);
          }

          if (name === "aboutImage") {
            setPreviewImageAbout(oldAboutBanner);
          }
        }

        setFormInput(oldState => ({
          ...oldState,
          [name]: {
            ...oldState[name],
            value: "",
            errorMessage: "",
          },
        }));
      }
    },
    [params, oldImageBanner, oldAboutBanner]
  );

  const handleShowToast = useCallback((message, title) => {
    toastr.options.closeButton = true;
    toastr.options.positionClass = "toast-top-center";
    toastr.options.closeMethod = "fadeOut";
    toastr.options.closeDuration = 300;
    toastr.options.closeEasing = "swing";
    toastr.success(message, title);
  }, []);

  const handleCreateWebsiteContent = useCallback(
    formData => {
      ApiCreateContentWebsite("home", formData).then(response => {
        if (response.status === 201) {
          setFormInput(oldState => ({
            ...oldState,
            bannerImage: {
              ...oldState.bannerImage,
              value: "",
              errorMessage: "",
            },
            aboutImage: {
              ...oldState.aboutImage,
              value: "",
              errorMessage: "",
            },
          }));
          handleShowToast("Data berhasil ditambahkan", "Tambah Data");
          setParams("update");
          const elementInputBannerImage =
            document.getElementsByName("bannerImage");
          elementInputBannerImage[0].value = null;
          const elementInputAboutImage =
            document.getElementsByName("aboutImage");
          elementInputAboutImage[0].value = null;
          handleGetContentWebsite();
        }
      });
    },
    [handleShowToast, handleGetContentWebsite]
  );

  const handleUpdateWebsiteContent = useCallback(
    formData => {
      ApiUpdateContentWebsite("home", formData).then(response => {
        if (response.status === 201) {
          setFormInput(oldState => ({
            ...oldState,
            bannerImage: {
              ...oldState.bannerImage,
              value: "",
              errorMessage: "",
            },
            aboutImage: {
              ...oldState.aboutImage,
              value: "",
              errorMessage: "",
            },
          }));
          handleShowToast("Data berhasil diedit", "Edit Data");
          const elementInputBannerImage =
            document.getElementsByName("bannerImage");
          elementInputBannerImage[0].value = null;
          const elementInputAboutImage =
            document.getElementsByName("aboutImage");
          elementInputAboutImage[0].value = null;
          handleGetContentWebsite();
        }
      });
    },
    [handleGetContentWebsite]
  );

  const handleSave = useCallback(() => {
    if (formInput.bannerTitle.value === "") {
      setFormInput(oldState => ({
        ...oldState,
        bannerTitle: {
          ...oldState.bannerTitle,
          errorMessage: "title banner wajib diisi",
        },
      }));
      return;
    }

    if (formInput.bannerDescription.value === "") {
      setFormInput(oldState => ({
        ...oldState,
        bannerDescription: {
          ...oldState.bannerDescription,
          errorMessage: "deskripsi banner wajib diisi",
        },
      }));
      return;
    }

    if (params === "create" && formInput.bannerImage.value === "") {
      setFormInput(oldState => ({
        ...oldState,
        bannerImage: {
          ...oldState.bannerImage,
          errorMessage: "gambar banner wajib diisi",
        },
      }));
      return;
    }

    if (formInput.aboutTitle.value === "") {
      setFormInput(oldState => ({
        ...oldState,
        aboutTitle: {
          ...oldState.aboutTitle,
          errorMessage: "title tentang wajib diisi",
        },
      }));
      return;
    }

    if (formInput.aboutDescription.value === "") {
      setFormInput(oldState => ({
        ...oldState,
        aboutDescription: {
          ...oldState.aboutDescription,
          errorMessage: "deskripsi tentang wajib diisi",
        },
      }));
      return;
    }

    if (params === "create" && formInput.aboutImage.value === "") {
      setFormInput(oldState => ({
        ...oldState,
        aboutImage: {
          ...oldState.aboutImage,
          errorMessage: "gambar tentang wajib diisi",
        },
      }));
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("bannerTitle", formInput.bannerTitle.value);
    formData.append("bannerDescription", formInput.bannerDescription.value);
    formData.append("bannerImage", formInput.bannerImage.value);
    formData.append("aboutTitle", formInput.aboutTitle.value);
    formData.append("aboutDescription", formInput.aboutDescription.value);
    formData.append("aboutImage", formInput.aboutImage.value);

    if (params === "create") {
      handleCreateWebsiteContent(formData);
    } else {
      handleUpdateWebsiteContent(formData);
    }
  }, [
    params,
    formInput,
    handleCreateWebsiteContent,
    handleUpdateWebsiteContent,
  ]);

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title={"Website"} breadcrumbItem={"Home"} />

        <Row>
          <Col md="12">
            <Card>
              <CardBody>
                <Row className="mb-4">
                  <CardTitle className="mb-2">Banner</CardTitle>
                  <Form>
                    <Col md="12" className="mb-3">
                      <Label>Title</Label>
                      <Input
                        type="text"
                        name="bannerTitle"
                        value={formInput.bannerTitle.value || ""}
                        onChange={handleChangeInput}
                        disabled={isLoading}
                        invalid={formInput.bannerTitle.errorMessage !== ""}
                      />
                      {formInput.bannerTitle.errorMessage && (
                        <FormFeedback type="invalid">
                          {formInput.bannerTitle.errorMessage}
                        </FormFeedback>
                      )}
                    </Col>

                    <Col md="12" className="mb-3">
                      <Label>Deskripsi</Label>
                      <Input
                        type="textarea"
                        name="bannerDescription"
                        rows="4"
                        value={formInput.bannerDescription.value}
                        onChange={handleChangeInput}
                        disabled={isLoading}
                        invalid={
                          formInput.bannerDescription.errorMessage !== ""
                        }
                      />
                      {formInput.bannerDescription.errorMessage && (
                        <FormFeedback type="invalid">
                          {formInput.bannerDescription.errorMessage}
                        </FormFeedback>
                      )}
                    </Col>

                    <Col md="12" className="mb-3">
                      <Label>Gambar</Label>
                      {previewImageBanner !== "" && (
                        <div className="mb-3">
                          <div
                            style={{
                              width: "100%",
                              height: 420,
                              borderRadius: "50%",
                            }}
                          >
                            <CardImg
                              src={previewImageBanner}
                              width="100%"
                              height="100%"
                            />
                          </div>
                        </div>
                      )}
                      <Input
                        type="file"
                        name="bannerImage"
                        // value={formInput.bannerImage.value.filename}
                        disabled={isLoading}
                        onChange={handleChangeImage}
                        invalid={formInput.bannerImage.errorMessage !== ""}
                      />
                      {formInput.bannerImage.errorMessage && (
                        <FormFeedback type="invalid">
                          {formInput.bannerImage.errorMessage}
                        </FormFeedback>
                      )}
                    </Col>
                  </Form>
                </Row>

                <Row className="mb-4">
                  <CardTitle className="mb-2">Tentang</CardTitle>
                  <Form>
                    <Col md="12" className="mb-3">
                      <Label>Title</Label>
                      <Input
                        type="text"
                        name="aboutTitle"
                        value={formInput.aboutTitle.value || ""}
                        onChange={handleChangeInput}
                        disabled={isLoading}
                        invalid={formInput.aboutTitle.errorMessage !== ""}
                      />
                      {formInput.aboutTitle.errorMessage && (
                        <FormFeedback type="invalid">
                          {formInput.aboutTitle.errorMessage}
                        </FormFeedback>
                      )}
                    </Col>

                    <Col md="12" className="mb-3">
                      <Label>Deskripsi</Label>
                      <Input
                        type="textarea"
                        name="aboutDescription"
                        rows="4"
                        value={formInput.aboutDescription.value || ""}
                        onChange={handleChangeInput}
                        disabled={isLoading}
                        invalid={formInput.aboutDescription.errorMessage !== ""}
                      />
                      {formInput.aboutDescription.errorMessage && (
                        <FormFeedback type="invalid">
                          {formInput.aboutDescription.errorMessage}
                        </FormFeedback>
                      )}
                    </Col>

                    <Col md="12" className="mb-3">
                      <Label>Gambar</Label>
                      {previewImageAbout !== "" && (
                        <div className="mb-3">
                          <div
                            style={{
                              width: "100%",
                              height: 420,
                              borderRadius: "50%",
                            }}
                          >
                            <CardImg
                              src={previewImageAbout}
                              width="100%"
                              height="100%"
                            />
                          </div>
                        </div>
                      )}
                      <Input
                        type="file"
                        name="aboutImage"
                        // value={formInput.aboutImage.value.filename}
                        disabled={isLoading}
                        onChange={handleChangeImage}
                        invalid={formInput.aboutImage.errorMessage !== ""}
                      />
                      {formInput.aboutImage.errorMessage && (
                        <FormFeedback type="invalid">
                          {formInput.aboutImage.errorMessage}
                        </FormFeedback>
                      )}
                    </Col>
                  </Form>
                </Row>

                <Row>
                  <Col md="12" className="d-flex justify-content-end">
                    <Button
                      color="primary"
                      disabled={isLoading}
                      onClick={handleSave}
                    >
                      <i className="bx bx-save font-size-16 align-middle me-2" />
                      Simpan
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Index;
