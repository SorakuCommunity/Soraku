import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

import { getDb, createUser, deleteUser, getUser, updateUser } from "@/prisma/user";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (session) {
    // Signed in
    try {
      switch (req.method) {
        case "POST": {
          const { name } = req.body;
          const new_user = await createUser(name);
          if (!new_user) {
            return res.status(200).json({ message: "User is already created" });
          } else {
            return res.status(201).json(new_user);
          }
        }
        case "PUT": {
          const { name, settings } = req.body;
          // Validate and sanitize the settings object
          const validSettings = {
            CustomLists: settings.CustomLists,
            Theme: settings.Theme,
            ShowTrailer: settings.ShowTrailer,
            ShowSauce: settings.ShowSauce,
            IncognitoMode: settings.IncognitoMode,
            AnilistPaused: settings.AnilistPaused,
            DataSaver: settings.DataSaver, // Added DataSaver setting
            PreferredQuality: settings.PreferredQuality, // Added PreferredQuality setting
            IsDub: settings.IsDub, // Added IsDub setting
            IsHardSub: settings.IsHardSub, // Added IsHardSub setting
            NavigationOption: settings.NavigationOption, // Added NavigationOption setting
            UseOldNav: settings.UseOldNav // Added UseOldNav setting
          };
          const user = await updateUser(name, validSettings);
          if (!user) {
            return res.status(200).json({ message: "Can't update settings" });
          } else {
            return res.status(200).json(user);
          }
        }
        case "GET": {
          const { name } = req.query;
          const user = await getUser(name);
          if (!user) {
            return res.status(404).json({ message: "User not found" });
          } else {
            return res.status(200).json(user);
          }
        }
        case "DELETE": {
          const { name } = req.body;
          if (session.user.name !== name) {
            return res.status(401).json({ message: "Unauthorized" });
          } else {
            const user = await deleteUser(name);
            if (!user) {
              return res.status(404).json({ message: "User not found" });
            } else {
              return res.status(200).json(user);
            }
          }
        }
        default: {
          return res.status(405).json({ message: "Method not allowed" });
        }
      }
    } catch (error) {
      console.error("Error in API handler:", error); // Improved logging
      return res.status(500).json({ message: "Internal server error", error: error.message }); // Return error message
    }
  } else {
    // Not Signed in
    return res.status(401).json({ message: "Unauthorized" }); // Return JSON response
  }
  res.end();
}
