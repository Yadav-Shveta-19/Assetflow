import { buildQueryOptions } from "../utils/pagination.js";
import { sendCreated, sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const crudController = (Model, searchable = []) => ({
  list: asyncHandler(async (req, res) => {
    const { page, limit, skip, sort, search } = buildQueryOptions(req.query);
    const filter = {};
    if (search && searchable.length) filter.$or = searchable.map((field) => ({ [field]: new RegExp(search, "i") }));
    for (const [key, value] of Object.entries(req.query)) {
      if (!["page", "limit", "sort", "search"].includes(key) && value !== "") filter[key] = value;
    }
    const [items, total] = await Promise.all([Model.find(filter).sort(sort).skip(skip).limit(limit), Model.countDocuments(filter)]);
    sendSuccess(res, items, "Records fetched", 200, { page, limit, total, pages: Math.ceil(total / limit) });
  }),
  get: asyncHandler(async (req, res) => {
    const item = await Model.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Record not found" });
    sendSuccess(res, item, "Record fetched");
  }),
  create: asyncHandler(async (req, res) => sendCreated(res, await Model.create(req.body))),
  update: asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: "Record not found" });
    sendSuccess(res, item, "Record updated");
  }),
  remove: asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Record not found" });
    sendSuccess(res, item, "Record deleted");
  })
});
