module.exports = {

  getClosestStore: async (req, res, next) => {
    try {
      res.send('Get closest store')
    } catch (error) {
      next(error)
    }
  }

}
