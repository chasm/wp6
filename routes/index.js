const passport   = require("koa-passport")

let home = function *() {
  if (this.isAuthenticated()) {
    yield this.render("index", { name: this.req.user.name })
  } else {
    yield this.render("login")
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

export default function (router) {
  return function *(next) {
    router.get("/", home)
    router.post("/login", login)
    router.get("/logout", logout)

    yield next
  }
}

