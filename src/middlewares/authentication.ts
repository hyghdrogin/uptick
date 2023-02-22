import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import models from "../models";
import config from "../configuration";
import { errorResponse } from "../utilities/responses";

/**
 * @class Authentication
 * @description Authenticate Token
 * @exports Authentication
 */
export default class Authentication {
  static async authenticate(req: Request, res:Response, next:NextFunction) {
    try {
      const authenticationHeader = req.headers.authorization;
      if (!authenticationHeader) {
        return errorResponse(res, 401, "Unauthorized");
      }
      const headerSplit = authenticationHeader.split(" ");
      if (/^Bearer$/i.test(headerSplit[0])) {
        const decodeToken = jwt.verify(headerSplit[1], config.JWT) as { _id: string };
        const user = await models.User.findById(decodeToken._id);
        if (!user) {
          return errorResponse(res, 404, "User not found");
        }
        req.user = user;
        return next();
      }
      return errorResponse(res, 401, "Invvalid Authentication format");
    } catch (error) {
      return errorResponse(res, 500, "Server Error");
    }
  }
}
