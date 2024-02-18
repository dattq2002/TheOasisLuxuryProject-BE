export class AccountStatus {
  public static readonly ACTIVE = 'ACTIVE';
  public static readonly BAN = 'BANNED';
}
export class ProjectStatus {
  public static readonly ACTIVE = 'ACTIVE';
  public static readonly INACTIVE = 'INACTIVE';
}
export class SubdivisionStatus {
  public static readonly ACTIVE = 'ACTIVE';
  public static readonly INACTIVE = 'INACTIVE';
}
export class VillaStatus {
  public static readonly ACTIVE = 'ACTIVE';
  public static readonly INACTIVE = 'INACTIVE';
  public static readonly SOLD = 'SOLD';
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

export class OrderStatus {
  public static readonly PENDING = 'PENDING';
  public static readonly CONFIRMED = 'CONFIRMED';
  public static readonly CANCELLED = 'CANCELLED';
  public static readonly COMPLETED = 'COMPLETED';
}
export class PaymentStatus {
  public static readonly PENDING = 'PENDING';
  public static readonly PAID = 'PAID';
  public static readonly CANCELLED = 'CANCELLED';
}

export enum Time_ShareType {
  DAY,
  MONTH,
  YEAR
}

export enum PaymentType {
  CASH,
  CREDIT_CARD
}
export enum TokenType {
  AccessToken,
  RefeshToken,
  ForgotPasswordToken,
  EmailVerificationToken
}
export enum UserVerifyStatus {
  Unverified, // chưa xác thực email, mặc định = 0
  Verified, // đã xác thực email
  Banned // bị banned
}
