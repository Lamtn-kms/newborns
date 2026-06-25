export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface ICourse {
  id: string;
  title: string;
  description: string;
  status: string;
}

export interface ILoginResponse {
  token: string;
  user: IUser;
}

export interface IApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}
