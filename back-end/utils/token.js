
import jwt from "jsonwebtoken";

export const generateToken = (user, res) => {
  console.log("loging res",res);
  console.log("loging user",user);
  
  // if (!user.admin) {
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    const refreshToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: false,
      secure: true,
      sameSite: "none",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    res.cookie("refreshtoken", refreshToken, {
      httpOnly: false,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("user", JSON.stringify(user), {
      // httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
//   } else {
//     const admtoken = jwt.sign(
//       { id: user._id, admin: true },
//       process.env.ADM_JWT_KEY,
//       { expiresIn: "30d" }
//     );

//     const admrefreshToken = jwt.sign(
//       { id: user._id, admin: true },
//       process.env.ADM_JWT_KEY,
//       { expiresIn: "7d" }
//     );

//     res.cookie("admin", JSON.stringify(user), {
//       httpOnly: true,
//       secure: true,
//       sameSite: "none",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     res.cookie("admtoken", admtoken, {
//       httpOnly: true,
//       secure: true,
//       sameSite: "none",
//       maxAge: 3 * 24 * 60 * 60 * 1000,
//     });

//     res.cookie("admrefreshToken", admrefreshToken, {
//       httpOnly: true,
//       secure: true,
//       sameSite: "none",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });
//   }
};
