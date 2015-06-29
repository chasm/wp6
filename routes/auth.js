const passport   = require("koa-passport")
const postmark   = require("postmark")
const client     = new postmark.Client("a745fc7b-86cf-4288-a205-e1a004d08d25")
const slugid     = require("slugid")

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
      resetCode: id
    }

    let result1 = yield r.db("quoth").table("users").get(userId).update(user).run()

    if(result1.replaced === 1 ) {

      let sender = "oni.omowunmi@andela.co"
      let subject = "[Quoth] Reset your credentials"
      let body = "Someone requested to reset your Quoth credentials. To change them " +
        "please follow this link: http://localhost:3000/reset/" + id
      let receiver = email

      try {

        let result2 = yield getPostmarkThunk(sender, receiver, subject, body)

        if (result2) {

          this.type = "application/json"
          this.body = JSON.stringify(result2)
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

let resetForm = function *() {
  this.type = "application/json"
  this.body = JSON.stringify("Yeahhhhh")
}

let updatePassword = function *() {

}

export default function (router) {
  return function *(next) {
    router.post("/login", login)
    router.delete("/logout", logout)
    router.post("/reset", reset)
    router.get("/reset/:id", resetForm)
    router.put("/reset/:id", updatePassword)

    yield next
  }
}
