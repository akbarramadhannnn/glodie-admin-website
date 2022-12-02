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
    bannerDescription: {
      value: "",
      errorMessage: "",
    },
    bannerImage: {
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
    ApiGetContentWebsite("teams").then(response => {
      const regex = /[^"']+\.(?:(?:pn|jpe?)g|gif)\b/;

      const newObj = {
        bannerDescription: {
          value: "",
          errorMessage: "",
        },
        bannerImage: {
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
        } else if (params === "update") {
          if (name === "bannerImage") {
            setPreviewImageBanner(oldImageBanner);
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
    [params, oldImageBanner]
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
      ApiCreateContentWebsite("teams", formData).then(response => {
        if (response.status === 201) {
          setFormInput(oldState => ({
            ...oldState,
            bannerImage: {
              ...oldState.bannerImage,
              value: "",
              errorMessage: "",
            },
          }));
          handleShowToast("Data berhasil ditambahkan", "Tambah Data");
          setParams("update");
          const elementInputBannerImage =
            document.getElementsByName("bannerImage");
          elementInputBannerImage[0].value = null;
          handleGetContentWebsite();
        }
      });
    },
    [handleShowToast, handleGetContentWebsite]
  );

  const handleUpdateWebsiteContent = useCallback(
    formData => {
      ApiUpdateContentWebsite("teams", formData).then(response => {
        if (response.status === 201) {
          setFormInput(oldState => ({
            ...oldState,
            bannerImage: {
              ...oldState.bannerImage,
              value: "",
              errorMessage: "",
            },
          }));
          handleShowToast("Data berhasil diedit", "Edit Data");
          const elementInputBannerImage =
            document.getElementsByName("bannerImage");
          elementInputBannerImage[0].value = null;
          handleGetContentWebsite();
        }
      });
    },
    [handleGetContentWebsite]
  );

  const handleSave = useCallback(() => {
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

    setIsLoading(true);

    const formData = new FormData();
    formData.append("bannerDescription", formInput.bannerDescription.value);
    formData.append("bannerImage", formInput.bannerImage.value);

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
        <Breadcrumbs title={"Website"} breadcrumbItem={"Team"} />

        <Row>
          <Col md="12">
            <Card>
              <CardBody>
                <Row className="mb-4">
                  <CardTitle className="mb-2">Banner</CardTitle>
                  <Form>
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
