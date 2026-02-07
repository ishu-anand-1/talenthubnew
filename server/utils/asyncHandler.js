/**
 * asyncHandler
 * ---------------------------------
 * A utility to wrap async Express route handlers
 * and forward errors to the global error middleware.
 *
 * This removes the need for try/catch blocks
 * in every controller.
 *
 * @param {Function} fn - async route handler
 * @returns {Function} Express middleware
 *
 * Example:
 * router.get(
 *   "/",
 *   asyncHandler(async (req, res) => {
 *     const data = await Service.getData();
 *     res.status(200).json(data);
 *   })
 * );
 */

const asyncHandler = (fn) => {
  if (typeof fn !== "function") {
    throw new TypeError("asyncHandler expects a function");
  }

  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;
