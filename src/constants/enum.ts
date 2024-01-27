export class SubdivisionStatus {
  public static readonly ACTIVE = 'ACTIVE';
  public static readonly INACTIVE = 'INACTIVE';
}
export enum TokenType {
  AccessToken,
  RefeshToken,
  ForgotPasswordToken,
  EmailVerificationToken
}
export enum UserVerifyStatus {
  Unverified, // chưa xác thực email, mặc định = 0
  Verified // đã xác thực email
}
