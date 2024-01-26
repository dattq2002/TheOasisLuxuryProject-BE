export class AccountStatus {
  public static readonly ACTIVE = 'ACTIVE';
  public static readonly BAN = 'BANNED';
}
export class ProjectStatus {
  public static readonly ACTIVE = 'ACTIVE';
  public static readonly BAN = 'INACTIVE';
}
export class SubdivisionStatus {
  public static readonly ACTIVE = 'ACTIVE';
  public static readonly BAN = 'INACTIVE';
}
export class GenderType {
  public static readonly MALE = 'MALE';
  public static readonly FEMALE = 'FEMALE';
  public static readonly OTHER = 'OTHER';
}
export class RoleName {
  public static readonly ADMIN = 'ADMIN';
  public static readonly USER = 'USER';
  public static readonly STAFF = 'STAFF';
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
