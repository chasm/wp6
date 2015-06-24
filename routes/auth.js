const passport   = require("koa-passport")

let login = function *(next) {
  let ctx = this

  ctx.request.body.username = this.request.body.fields.email
  ctx.request.body.password = this.request.body.fields.password

  yield* passport.authenticate("local", function *(err, user, info) {
    if (err) { throw err }

    if (user !== false) { yield ctx.login(user) }

    let out = {
      email: user.email,
      fullname: user.fullname,
      id: user.id,
      locale: user.locale,
      username: user.username
    }

    ctx.type = "application/json"
    ctx.body = JSON.stringify(out)

  }).call(this, next)
}

let logout = function *() {
  this.logout()
  this.status = 204
}

export default function (router) {
  return function *(next) {
    router.post("/login", login)
    router.delete("/logout", logout)

    yield next
  }
}
