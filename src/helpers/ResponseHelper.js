class ResponseHelper {
  static sendResponse(res, code, data) {
    // -------------- Error -----------------
    // return res.status(code).json({
    //   ...data,
    // });
    return res.render('layout', {
      template: '404',
      data: req.auth
    });
  }
}

module.exports = ResponseHelper;
