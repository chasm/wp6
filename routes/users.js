const r = require("rethinkdbdash")()

let create = function *(next) {
  this.status = 200
}

export default function (router) {
  return function *(next) {
    router.post("/signup", create)

    yield next
  }
}
