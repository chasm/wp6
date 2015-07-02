const formidable = require("koa-formidable")
const path       = require("path")

let profile = function *(next) {
  let files = this.request.body.files
  // let form = yield formidable.parse({
  //   uploadDir: path.join(__dirname, "/uploads")
  // }, this.request)

  console.log("files, form", files, this.req)

  this.status = 201
}

export default function (router) {
  return function *(next) {
    router.put("/profile/:id", profile)

    yield next
  }
}
