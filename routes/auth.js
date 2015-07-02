const passport   = require("koa-passport")
const postmark   = require("postmark")
const client     = new postmark.Client("a745fc7b-86cf-4288-a205-e1a004d08d25")
const slugid     = require("slugid")
const moment     = require("moment")
const bcrypt     = require("bcryptjs")

const r = require("rethinkdbdash")()


let login = function *(next) {
  let ctx = this

  ctx.request.body.username = this.request.body.fields.email
  ctx.request.body.password = this.request.body.fields.password

  yield* passport.authenticate("local", function *(err, user, info) {
    if (err) { throw err }

    if (user !== false) {
      yield ctx.login(user)

      let out = {
        email: user.email,
        fullname: user.fullname,
        id: user.id,
        locale: user.locale,
        username: user.username
      }

      ctx.type = "application/json"
      ctx.body = JSON.stringify(out)
    } else {
      ctx.status = 401
    }

  }).call(this, next)
}

let logout = function *() {
  this.logout()
  this.status = 204
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
  let email = this.request.body.fields.email
  let id = slugid.v4()

  let result = yield r.db("quoth").table("users").filter({ email: email}).run()

  if (result) {

    let userId = result[ 0 ].id
    let user = {
      resetCode: id,
      resetExpiresAt: moment().add(2, "hours").toDate()
    }

    let updated = yield r.db("quoth").table("users").get(userId).update(user).run()

    if(updated.replaced === 1 ) {
      let sender = "oni.omowunmi@andela.co"
      let subject = "[Quoth] Reset your credentials"
      let body = "Someone requested to reset your Quoth credentials. To change them " +
        "please follow this link: http://localhost:3000/reset/" + id

      let receiver = email

      try {
        let thunk = yield getPostmarkThunk(sender, receiver, subject, body)

        if (thunk) {
          this.type = "application/json"
          this.body = JSON.stringify(thunk)
        } else {
          this.status = 400
        }
      } catch (err) {
        console.log("err", err)
      }
    } else {
      console.log("error updating user")
    }
  } else {
    this.status = 404
  }
}

let updatePassword = function *(next) {
  let fields = this.request.body.fields

  let userCode = this.params.id
  let password = bcrypt.hashSync(fields.password, 12)

  let result = yield r.db("quoth").table("users").filter({ resetCode: userCode}).run()

  if (result.length > 0) {

    let userId = result[ 0 ].id

    let userPwd = {
      digest: password
    }

    let updated = yield r.db("quoth").table("users").get(userId).update(userPwd).run()

    if(updated.replaced === 1 ) {
      r.db("quoth").table("users").get(userId)
        .replace(r.row.without("resetCode").without("resetExpiresAt")).run()

      let ctx = this

      ctx.request.body.username = result[ 0 ].email
      ctx.request.body.password = password

      yield* passport.authenticate("local", function *(err, user, info) {
        if (err) { throw err }

        console.log(user, "login user", ctx.login )
        if (user !== false) { yield ctx.login(user) }

        ctx.redirect("/")

      }).call(this, next)
    }

  }
}

export default function (router) {
  return function *(next) {
    router.post("/login", login)
    router.delete("/logout", logout)
    router.post("/reset", reset)
    router.put("/reset/:id", updatePassword)

    yield next
  }
}
