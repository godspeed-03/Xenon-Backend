import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  Property_Name: String,
  Property_id: Number,
  Property_type: String,
  Property_status: String,
  Price_per_unit_area: Number,
  Posted_On: String,
  City_name: String,
  No_of_BHK: String,
  Locality_Name: String,
  Price: String,
});

const Property = mongoose.model("Property", propertySchema);

export default Property;
