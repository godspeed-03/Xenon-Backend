import Property from "../models/Property.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getProperty = async (req, res, next) => {
  try {
    const { page = 1, limit = 15, search = "" } = req.query; // Default to page 1 and limit 15 if not provided
    const regexSearch = new RegExp(search, 'i');
    const properties = await Property.find({
        $or: [
            { Property_Name: { $regex: regexSearch } },
            { City_name: { $regex: regexSearch } },
            { Status: { $regex: regexSearch } }
          ],
    })
      .skip((page - 1) * limit) // Skip records for pagination
      .limit(limit); // Limit the number of records per page

    const totalProperties = await Property.countDocuments({
        $or: [
            { Property_Name: { $regex: regexSearch } },
            { City_name: { $regex: regexSearch } },
            { Status: { $regex: regexSearch } }
          ],
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, {
          totalProperties,
          properties,
          totalPages: Math.ceil(totalProperties / limit),
          currentPage: page,
        }, "Properties fetchd succesfully")
      );
  } catch (error) {
    next(error);
  }
};
