import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  // DropdownItem,
} from "reactstrap";
import { withRouter, Link } from "react-router-dom";
import { authLogoutAction } from "../../../store/auth/actions";

//i18n
import { useTranslation } from "react-i18next";

// users
import user1 from "../../../assets/images/users/avatar-1.jpg";

const ProfileMenu = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const authSelector = useSelector(({ Auth }) => Auth);
  const [menu, setMenu] = useState();
  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item"
          id="page-header-user-dropdown"
          tag="button"
        >
          <img
            className="rounded-circle header-profile-user"
            src={user1}
            alt="Header Avatar"
          />{" "}
          <span className="d-none d-xl-inline-block ms-1">
            {authSelector.user.name}
          </span>
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          {/* <DropdownItem tag="a" href="/profile">
            <i className="bx bx-user font-size-16 align-middle ms-1" />
            {this.props.t("Profile")}
          </DropdownItem>
          <DropdownItem tag="a" href="#">
            <i className="bx bx-wallet font-size-16 align-middle me-1" />
            {this.props.t("My Wallet")}
          </DropdownItem>
          <DropdownItem tag="a" href="#">
            <span className="badge bg-success float-end">11</span>
            <i className="bx bx-wrench font-size-17 align-middle me-1" />
            {this.props.t("Settings")}
          </DropdownItem>
          <DropdownItem tag="a" href="#">
            <i className="bx bx-lock-open font-size-16 align-middle me-1" />
            {this.props.t("Lock screen")}
          </DropdownItem> */}
          {/* <div className="dropdown-divider" /> */}
          <Link to="#" className="dropdown-item">
            <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
            <span onClick={() => dispatch(authLogoutAction())}>
              {t("Logout")}
            </span>
          </Link>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default withRouter(ProfileMenu);
