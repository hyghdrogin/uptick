import { Request, Response } from "express";
import models from "../models";
import { errorResponse, successResponse, handleError } from "../utilities/responses";
import {
  NoteInterface, NoteUpdateInterface
} from "../utilities/interfaces";

/**
 * @class NoteController
 * @description create, log in Note
 * @exports NoteController
 */
export default class NoteController {
  /**
   * @param {object} req - The reset request object
   * @param {object} res - The reset errorResponse object
   * @returns {object} Success message
   */
  static async createNote(req: Request, res: Response) {
    try {
      const { _id } = req.user;
      const { heading, noteField }: NoteUpdateInterface = req.body;
      const user = await models.User.findById({ _id });
      if (!user) {
        return errorResponse(res, 404, "User not found, kindly register an account");
      }
      const note: NoteInterface = await models.Note.create({ owner: user.userName, heading, noteField });
      return successResponse(res, 201, "Note created successfully", { note });
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
  static async readNote(req: Request, res: Response) {
    try {
      const { _id } = req.user;
      const { noteId } = req.params;
      const user = await models.User.findById({ _id });
      if (!user) {
        return errorResponse(res, 404, "User not found, kindly register an account");
      }
      const note = await models.Note.findById({ _id: noteId });
      if (!note) {
        return errorResponse(res, 404, "Invalid Note Id");
      }
      if (note.owner !== user.userName) {
        return errorResponse(res, 404, "Note not found");
      }
      return successResponse(res, 201, "Note fetched successfully", { note });
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
  static async getAllNotes(req: Request, res: Response) {
    try {
      const { _id } = req.user;
      const user = await models.User.findById({ _id });
      const PAGE_SIZE = 10;
      const pageNumber = parseInt(req.query.page as string, 10) || 1;
      const offset = (pageNumber - 1) * PAGE_SIZE;

      const notes = await models.Note.find({ owner: user?.userName }).skip(offset).limit(PAGE_SIZE);
      const count = await models.Note.find({ owner: user?.userName }).countDocuments();

      const totalPages = Math.ceil(count / PAGE_SIZE);
      return successResponse(res, 201, "Note fetched successfully", {
        notes,
        count,
        totalPages,
        currentPage: pageNumber
      });
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
  static async updateNote(req: Request, res: Response) {
    try {
      const { _id } = req.user;
      const { noteId } = req.params;
      const { heading, noteField } = req.body;
      const user = await models.User.findById({ _id });
      const note = await models.Note.findById({ _id: noteId });
      if (note?.owner !== user?.userName) {
        return errorResponse(res, 403, "You can not update what is not yours");
      }
      const newNote = await models.Note.findByIdAndUpdate(noteId, { heading, noteField });
      return successResponse(res, 201, "Note updated successfully", { newNote });
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
  static async deleteNote(req: Request, res: Response) {
    try {
      const { _id } = req.user;
      const user = await models.User.findById({ _id });
      const { noteId } = req.params;
      const note = await models.Note.findById(noteId);
      if (note?.owner !== user?.userName) {
        return errorResponse(res, 403, "You can not delete what is not yours!!!");
      }
      await models.Note.deleteOne({ noteId });
      return successResponse(res, 201, "Note deleted successfully");
    } catch (error) {
      handleError(error, req);
      return errorResponse(res, 500, "Server error");
    }
  }
}
