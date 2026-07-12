export const buildQueryOptions = (query) => {
  const page = Math.max(Number(query.page || 1), 1);
  const limit = Math.min(Math.max(Number(query.limit || 20), 1), 100);
  const skip = (page - 1) * limit;
  const sort = query.sort || "-createdAt";
  const search = query.search?.trim();
  return { page, limit, skip, sort, search };
};
