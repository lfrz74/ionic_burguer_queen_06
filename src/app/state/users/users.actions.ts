export class GetUser {
  static readonly type = '[Users] Get User';
  constructor(public payload: { email: string }) {}
}
