import { Request } from "express";

import { Types } from "mongoose";

interface User {
  firstName: string;
  lastName: string;
  avatar?: string;
  email: string;
  password: string;
  passwordConfirm: string;
  phone: string;
  location?: {
    state?: string;
    town?: string;
    address?: string;
  };
  isAdmin?: boolean;
  createdAt?: Date;
}

export default User;
