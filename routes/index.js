const passport   = require("koa-passport")
const postmark   = require("postmark")
const client     = new postmark.Client("<key>")
const slugid     = require("slugid")

let home = function *() {
  if (this.isAuthenticated()) {
    yield this.render("index", { name: this.req.user.name })
  } else {
    yield this.render("index")
  }
}

let login = function *(next) {
  let ctx = this

  ctx.request.body.username = this.request.body.fields.email
  ctx.request.body.password = this.request.body.fields.password

  yield* passport.authenticate("local", function *(err, user, info) {
    if (err) { throw err }

    if (user !== false) { yield ctx.login(user) }

    ctx.redirect("/")

  }).call(this, next)
}

let logout = function *() {
  this.logout()
  this.redirect("/")
}

let getPostmarkThunk = (sender, receiver, subject, body) => {
  return (callback) => {
    client.sendEmail({
      "From": sender,
      "To": receiver,
      "Subject": subject,
      "TextBody": body
    }, callback)
  }
}

let reset = function *() {
  let id = slugid.v4()
  let sender = "<registered email>"
  let subject = "[Quoth] Reset your credentials"
  let body = "Someone requested to reset your Quoth credentials. To change them " +
    "please follow this link: http://localhost:3000/reset/" + id
  let receiver = this.request.body.fields.email

  let result = yield getPostmarkThunk(sender, receiver, subject, body)

  if (result) {
    this.type = "application/json"
    this.body = JSON.stringify(result)
  } else {
    this.status = 400
  }
}

let resetForm = function *() {

}

let updatePassword = function *() {

}

export default function (router) {
  return function *(next) {
    router.get("/", home)
    router.post("/login", login)
    router.get("/logout", logout)
    router.post("/reset", reset)
    router.get("/reset/:id", resetForm)
    router.put("/reset/:id", updatePassword)
    router.get("/:page", home)

    yield next
  }
}
