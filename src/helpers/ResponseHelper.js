class ResponseHelper {
  static sendResponse(res, code, data) {
    // -------------- Error -----------------
    // return res.status(code).json({
    //   ...data,
    // });
    return res.render("404");
  }
}

module.exports = ResponseHelper;
