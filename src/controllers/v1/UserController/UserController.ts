import { Request, Response } from "express";
import ModelUsers from "../../../models/ModelUsers";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../../configs/constants";
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phoneNumber, role } = req.body;

    if (!name || !email || !password || !phoneNumber || !role) {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        message: "Invalid request!",
        error: {},
      });
    }

    const existingUser = await ModelUsers.findOne({
      role: role,
      $or: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      let errorMessage: string = "";
      if (existingUser.email === email) {
        errorMessage = "User already exists with this email.";
      } else {
        errorMessage = "User already exists with this phone number.";
      }
      return res.status(400).json({
        status: false,
        statusCode: 400,
        message: errorMessage,
        error: {},
        date: new Date().toISOString(),
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new ModelUsers({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
      isActive: true,
    });

    await newUser.save();
    res.status(200).send({
      status: true,
      statusCode: 200,
      message: "Register Successfully.",
      error: {},
      extra: {},
      data: {},
      date: new Date().toISOString(),
    });
  } catch (error: any) {
    return res.status(500).send({
      status: false,
      statusCode: 500,
      message: "Something went wrong!!!",
      error: {
        error: error.toString(),
      },
      data: {},
      date: new Date().toISOString(),
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { emailOrPhone, password, from } = req.body;

    if (!emailOrPhone || !password || !from) {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        message: "Invalid request!",
        error: {},
      });
    }
    const user = await ModelUsers.findOne({
      role: from,
      $or: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }],
    });

    if (!user) {
      return res.status(404).json({
        status: false,
        statusCode: 404,
        message: "User Not Found!",
        error: {},
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "Invalid password.",
        error: {},
      });
    }

    const token = jwt.sign(
      { userId: user._id, name: user.name, role: user.role },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    res.status(200).send({
      status: true,
      statusCode: 200,
      message: "Login Successfully.",
      error: {},
      extra: {},
      data: { user, token },
      date: new Date().toISOString(),
    });
  } catch (error: any) {
    return res.status(500).send({
      status: false,
      statusCode: 500,
      message: "Something went wrong!!!",
      error: {
        error: error.toString(),
      },
      data: {},
      date: new Date().toISOString(),
    });
  }
};
