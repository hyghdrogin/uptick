import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import models from "../models";
import config from "../configuration";
import { errorResponse, successResponse, handleError } from "../utilities/responses";
import { UserInterface } from "../utilities/interfaces";

/**
 * @class UserController
 * @description create, log in user
 * @exports UserController
 */
export default class UserController {
  /**
   * @param {object} req - The reset request object
   * @param {object} res - The reset errorResponse object
   * @returns {object} Success message
   */
  static async createUser(req: Request, res: Response) {
    try {
      const {
        email, password, retypePassword
      } = req.body;
      const user = await models.User.findOne({ email });
      if (user) {
        return errorResponse(res, 409, "User already exists, Kindly login");
      }
      const userName = email.substring(0, email.lastIndexOf("@"));
      if (password !== retypePassword) {
        return errorResponse(res, 400, "Password does not match");
      }
      const encryptedPassword = await bcrypt.hash(password, 10);
      const userDetails: UserInterface = await models.User.create({
        userName, email, password: encryptedPassword
      });
      return successResponse(res, 201, "User created successfully, login", { userDetails });
    } catch (error) {
      handleError(error, req);
      return errorResponse(res, 500, "Server error");
    }
  }

  /**
   * @param {object} req - The reset request object
   * @param {object} res - The reset errorResponse object
   * @returns {object} Success message
   */
  static async userLogin(req: Request, res: Response) {
    try {
      const { email, password, remember } = req.body;
      const user = await models.User.findOne({
        $or: [{
          email
        }, {
          userName: email
        }]
      });
      if (!user) {
        return errorResponse(res, 404, "User not found");
      }
      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        return errorResponse(res, 404, "Password is not correct!.");
      }
      const { _id } = user;
      const jwtUser = { _id, email };
      let token;
      if (remember) {
        token = await jwt.sign(jwtUser, config.JWT, { expiresIn: "7d" });
      } else {
        token = await jwt.sign(jwtUser, config.JWT, { expiresIn: "3h" });
      }
      const details = {
        _id,
        email: user.email,
        userName: user.userName
      };
      return successResponse(res, 200, "User logged in successfully", { token, details });
    } catch (error) {
      handleError(error, req);
      return errorResponse(res, 500, "Server error");
    }
  }
}
