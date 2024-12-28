import { PythonShell } from "python-shell";
import User from "../models/User.model.js";
import Property from "../models/Property.model.js";

export const recommended = async (req, res, next) => {
  try {
    const userId = req.user._id;
    console.log(userId)

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    const searchHistory = user.searchHistory;

    const properties = await Property.find().select(
      "Property_Name City_name Price"
    );
    if (!properties.length) {
      return res.status(404).send("No properties found");
    }

    const propertyDescriptions = properties.map(
      (property) => `${property.Property_Name} in ${property.City_name}`
    );

    PythonShell.run(
      "src/config/recomendation.py",
      {
        args: [
          JSON.stringify(searchHistory),
          JSON.stringify(propertyDescriptions),
        ],
      },
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error in recommendation logic");
        }

        try {
          const recommendedIndices = JSON.parse(result[0]);
          const recommendedProperties = recommendedIndices.map(
            (index) => properties[index]
          );

          return res.json({ recommendedProperties });
        } catch (parseError) {
          console.error("Error parsing Python script result:", parseError);
          return res.status(500).send("Error processing recommendations");
        }
      }
    );
  } catch (error) {
    console.error(error);
    next(error);
  }
};
