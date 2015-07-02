const passport   = require("koa-passport")
const moment     = require("moment")

const r = require("rethinkdbdash")()

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

let resetForm = function *() {
  let userCode = this.params.id

  let result = yield r.db("quoth").table("users").filter({ resetCode: userCode}).run()

  if (result.length > 0) {
    let insertionTime = moment(result[ 0 ].resetExpiresAt)
    let now           = moment()

    if (now.diff(insertionTime) < 0) {
      let user = {
        resetExpiresAt: moment().add(2, "hours").toDate()
      }

      let updated = yield r.db("quoth").table("users").get(result[ 0 ].id).update(user).run()
      console.log("1")
      yield this.render("index")
    } else {
      console.log("2")
      r.db("quoth").table("users")
        .filter(r.row("resetExpiresAt").lt(r.now()))
        .replace(r.row.without("resetCode").without("resetExpiresAt")).run()

      this.redirect("/")
    }

  } else {
    console.log("3")
    this.redirect("/")
  }
}


export default function (router) {
  return function *(next) {
    router.get("/", home)
    router.post("/login", login)
    router.get("/logout", logout)
    router.get("/reset/:id", resetForm)
    router.get("/:page", home)
    router.get("/:page/:page", home)

    yield next
  }
}
