export const HOME_URL = "/";
export const LOGIN_URL = "/login";
export const REGISTER_URL = "/register";
export const FORGET_PASSWORD_URL = "/forget-password";
export const RESET_PASSWORD_URL = "/reset-password";
export const USER_VERIFICATION_URL = "/user-verification";
export const CATEGORY_URL = "/category";
export const SEARCH_URL = "/search";
export const EVENT_URL = "/event";
export const TICKET_URL = "/ticket";
export const PURCHASE_URL = "/purchase";
export const HISTORY_URL = "/history";
export const PROFILE_URL = "/profile";
export const SUPERADMIN_URL = "/superadmin";
export const ADMIN_URL = "/admin";
export const ADD_EVENT_URL = "/admin/add-event";
export const ADD_VENUE_URL = "/admin/add-venue";

export const URL = "http://localhost:3001";
export const REGISTER_API = `${URL}/auth/register`;
export const LOGIN_API = `${URL}/auth/login`;
export const LOGOUT_API = `${URL}/auth/logout`;
export const VERIFY_EMAIL_API = `${URL}/auth/verify-email`;
export const REFRESH_TOKEN_API = `${URL}/auth/refresh-token`;
export const SUBMIT_OTP_API = `${URL}/auth/verify-otp`;

export const PROFILE_API = `${URL}/account/profile`;
export const EDIT_PROFILE_API = `${URL}/account/edit`;
export const DELETE_ACCOUNT_API = `${URL}/account/delete`;
export const RESET_PASSWORD_API = `${URL}/account/reset-password`;
export const FORGET_PASSWORD_API = `${URL}/account/forget-password`;

export const ADMINS_API = `${URL}/admin`;
export const ADD_ADMINS_API = `${URL}/admin/add`;
export const DELETE_ADMINS_API = `${URL}/admin/delete`;

export const VENUE_API = `${URL}/venue`;
export const ADD_VENUE_API = `${URL}/venue/add`;
export const UPDATE_VENUE_API = `${URL}/venue/update`;

export const EVENT_API = `${URL}/event`;
export const ADD_EVENT_API = `${URL}/event/add`;
export const SEARCH_API = `${URL}/event/search`;
export const EVENT_DETAILS_API = `${URL}/event/details`;

export const REQUEST_API = `${URL}/request`;
export const UPDATE_REQUEST_API = `${URL}/request/update`;

export const ORDER_API = `${URL}/order`;
export const CREATE_ORDER_API = `${URL}/order/checkout`;
