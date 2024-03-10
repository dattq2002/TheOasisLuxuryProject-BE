export const USERS_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',
  NAME_IS_REQUIRED: 'Name is required',
  NAME_MUST_BE_A_STRING: 'Name must be a string',
  NAME_LENGTH_MUST_BE_FROM_1_TO_100: 'Name length must be from 1 to 100',
  EMAIL_IS_REQUIRED: 'Email is required',
  EMAIL_IS_INVALID: 'Email is invalid',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_MUST_BE_A_STRING: 'Password must be a string',
  PASSWORD_LENGTH_MUST_BE_FROM_8_TO_100: 'Password length must be from 8 to 100',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD_MUST_BE_A_STRING: 'Confirm password must be a string',
  CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_8_TO_100: 'Confirm password length must be from 8 to 100',
  CONFIRM_PASSWORD_IS_INCORRECT: 'Confirm password is incorrect',
  DATE_OF_BIRTH_IS_REQUIRED: 'Date of birth is required',
  DATE_OF_BIRTH_IS_INVALID: 'Date of birth is invalid',
  PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50: 'Password length must be from 8 to 50',
  PASSWORD_MUST_BE_STRONG: 'Password must be strong',
  CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50: 'Confirm password length must be from 8 to 50',
  CONFIRM_PASSWORD_MUST_BE_STRONG: 'Confirm password must be strong',
  CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD: 'Confirm password must be the same as password',
  DATE_OF_BIRTH_BE_ISO8601: 'Date must be ISO8601',
  REGISTER_SUCCESS: 'Register success',
  GET_USER_BY_ID_SUCCESS: 'Get user by id success',
  EMAIL_OR_PASSWORD_IS_INCORRECT: 'user_name or password is incorrect',
  LOGIN_SUCCESS: 'Login success',
  USER_NAME_IS_REQUIRED: 'User name is required',
  UPDATE_USER_SUCCESS: 'Update user success',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  USED_REFRESH_TOKEN_OR_NOT_EXIST: 'Used refresh token or not exist',
  LOGOUT_SUCCESS: 'Logout success',
  CREATE_ACCOUNT_SUCCESS: 'Create account success',
  UPDATE_ACCOUNT_SUCCESS: 'Update account success',
  GET_ACCOUNT_SUCCESS: 'Get account success',
  DELETE_ACCOUNT_SUCCESS: 'Delete account success',
  DELETE_ACCOUNT_FAIL: 'Delete account fail',
  PHONE_NUMBER_IS_REQUIRED: 'Phone number is required',
  PHONE_NUMBER_IS_INVALID: 'Phone number is invalid',
  USER_NOT_FOUND: 'User not found',
  USER_NOT_ACCESS: 'User not access',
  EMAIL_VERIFY_TOKEN_IS_REQUIRED: 'Email verify token is required',
  USER_BANNED: 'User banned',
  EMAIL_VERIFY_TOKEN_IS_NOT_MATCH: 'Email verify token is not match',
  EMAIL_ALREADY_VERIFIED_BEFORE: 'Email already verified before',
  EMAIL_VERIFY_SUCCESS: 'Email verify success',
  RESEND_EMAIL_VERIFY_SUCCESS: 'Resend email verify success',
  CHECK_EMAIL_TO_RESET_PASSWORD: 'Check email to reset password',
  VERIFY_FORGOT_PASSWORD_TOKEN_SUCCESS: 'Verify forgot password token success',
  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Forgot password token is required',
  INVALID_FORGOT_PASSWORD_TOKEN: 'Invalid forgot password token',
  RESET_PASSWORD_SUCCESS: 'Reset password success',
  REFRESH_TOKEN_SUCCESS: 'Refresh token success',
  ORDER_SUCCESS: 'Order success',
  CONFIRM_PAYMENT_SUCCESS: 'Confirm payment success',
  CREATE_BLOG_SUCCESS: 'Create blog success',
  USER_ID_IS_REQUIRED: 'User id is required',
  USER_ID_MUST_BE_A_STRING: 'User id must be a string',
  VILLA_TIME_SHARE_ID_IS_REQUIRED: 'Villa time share id is required',
  VILLA_TIME_SHARE_ID_MUST_BE_A_STRING: 'Villa time share id must be a string',
  PRICE_IS_REQUIRED: 'Price is required',
  PRICE_MUST_BE_A_NUMBER: 'Price must be a number',
  DESCRIPTION_IS_REQUIRED: 'Description is required',
  PAYMENT_TYPE_IS_REQUIRED: 'Payment type is required',
  PAYMENT_TYPE_MUST_BE_A_STRING: 'Payment type must be a string',
  PAYMENT_TYPE_IS_INVALID: 'Payment type is invalid',
  ORDER_ID_IS_REQUIRED: 'Order id is required',
  ORDER_ID_MUST_BE_A_STRING: 'Order id must be a string',
  CURRENCY_IS_REQUIRED: 'Currency is required',
  CURRENCY_MUST_BE_A_STRING: 'Currency must be a string',
  AMOUNT_IS_REQUIRED: 'Amount is required',
  AMOUNT_MUST_BE_A_NUMBER: 'Amount must be a number',
  PAYMENT_ID_IS_REQUIRED: 'Payment id is required',
  PAYMENT_ID_MUST_BE_A_STRING: 'Payment id must be a string',
  TITLE_IS_REQUIRED: 'Title is required',
  TITLE_MUST_BE_A_STRING: 'Title must be a string',
  DESCRIPTION_DETAIL_IS_REQUIRED: 'Description detail is required',
  DESCRIPTION_DETAIL_MUST_BE_A_STRING: 'Description detail must be a string',
  CONTRACT_NAME_IS_REQUIRED: 'Contract name is required',
  CONTRACT_NAME_MUST_BE_A_STRING: 'Contract name must be a string',
  URL_IMAGE_IS_REQUIRED: 'Url image is required',
  URL_IMAGE_MUST_BE_A_STRING: 'Url image must be a string',
  GET_ALL_ORDER_SUCCESS: 'Get all order success',
  UPDATE_ORDER_SUCCESS: 'Update order success',
  UPLOAD_SUCCESS: 'Upload success',
  CANNOT_DELETE_ADMIN_ACCOUNT: 'Cannot delete admin account',
  GET_ALL_CONTRACT_SUCCESS: 'Get all contract success',
  GET_ALL_BLOG_POST_SUCCESS: 'Get all blog post success',
  STATUS_IS_REQUIRED: 'Status is required',
  STATUS_IS_WRONG_TYPE: 'Status is wrong type and must be in [PENDING, APPROVED, REJECTED]',
  STATUS_MUST_BE_A_STRING: 'Status must be a string',
  GET_USER_OWN_VILLA_SUCCESS: 'Get user own villa success',
  CONFIRM_CONTRACT_SUCCESS: 'Confirm contract success',
  ACCOUNT_IS_INACTIVE_OR_BANNED: 'Account is inactive or banned',
  GET_ALL_PAYMENT_SUCCESS: 'Get all payment success'
} as const;

export const PROJECTS_MESSAGES = {
  GET_PROJECT_SUCCESS: 'Get project success',
  CREATE_PROJECT_SUCCESS: 'Create project success',
  UPDATE_PROJECT_SUCCESS: 'Update project success',
  DELETE_PROJECT_SUCCESS: 'Delete project success',
  ADD_SUBDIVISION_TO_PROJECT_SUCCESS: 'Add subdivision to project success',
  PROJECT_NOT_FOUND: 'Project not found',
  UPDATE_PROJECT_FAIL: 'Update project fail',
  INVALID_DATE_FORMAT: 'Invalid date format'
} as const;

export const SUBDIVISION_MESSAGES = {
  GET_SUBDIVISION_SUCCESS: 'Get subdivision success',
  CREATE_SUBDIVISION_SUCCESS: 'Create subdivision success',
  UPDATE_SUBDIVISION_SUCCESS: 'Update subdivision success',
  DELETE_SUBDIVISION_SUCCESS: 'Delete subdivision success'
} as const;

export const VILLAS_MESSAGES = {
  GET_VILLAS_SUCCESS: 'Get villas success',
  CREATE_VILLA_SUCCESS: 'Create villa success',
  UPDATE_VILLA_SUCCESS: 'Update villa success',
  DELETE_VILLA_SUCCESS: 'Delete villa success',
  GET_VILLA_SUCCESS: 'Get villa success',
  CREATE_VILLA_TIME_SHARE_SUCCESS: 'Create villa time share success',
  GET_VILLA_BY_SUBDIVISION_ID_SUCCESS: 'Get villa by subdivision id success',
  UPLOAD_IMAGE_VILLA_SUCCESS: 'Upload image villa success',
  CREATE_VILLA_DETAIL_SUCCESS: 'Create villa detail success',
  GET_VILLA_TIME_SHARE_BY_VILLA_ID_SUCCESS: 'Get villa time share by villa id success',
  VILLA_NOT_FOUND: 'Villa not found',
  SUBDIVISION_NOT_FOUND: 'Subdivision not found',
  GET_VILLA_TIME_SHARE_BY_ID_SUCCESS: 'Get villa time share by id success',
  GET_VILLA_TIME_SHARE_SUCCESS: 'Get villa time share success'
} as const;

export const UTILITIES_MESSAGES = {
  GET_UTILITIES_SUCCESS: 'Get utilities success',
  CREATE_UTILITIES_SUCCESS: 'Create utilities success',
  UPDATE_UTILITIES_SUCCESS: 'Update utilities success',
  DELETE_UTILITIES_SUCCESS: 'Delete utilities success',
  CREATE_UTILITIES_FAIL: 'Create utilities fail',
  GET_UTILITY_FAIL: 'Get utility fail',
  GET_UTILITY_SUCCESS: 'Get utility success',
  DELETE_UTILITIES_FAIL: 'Delete utilities fail'
} as const;
