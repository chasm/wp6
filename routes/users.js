const bcrypt     = require("bcryptjs")

const t = require("tcomb-form")
const validate = t.validate

const r = require("rethinkdbdash")()

let password = t.subtype(t.Str, (pwd) => {
  return pwd.length > 4
})

let email = t.subtype(t.Str, (e) => {
  let r = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i

  return r.test(e)
})

let fullname = t.subtype(t.Str, (name) => {
  let r = /^([A-Z]{2,})([\s]([A-Z]{2,})){1,}$/i

  return r.test(name)
})

let User = t.struct({
  fullname: fullname,
  username: t.Str,
  email: email,
  password: password,
  locale: t.maybe(t.Str),
  nobot: t.maybe(t.Str)
})

let create = function *(next) {
  let fields = this.request.body.fields

  let valid = validate(fields, User)

  if (valid.isValid()) {
    let user = {
      fullname: fields.fullname,
      username: fields.username,
      email: fields.email.toLowerCase(),
      digest: bcrypt.hashSync(fields.password, 12),
      locale: fields.locale,
      id: this.params.id
    }

    let result = yield r.db("quoth").table("users").insert(user).run()

    if (result.inserted === 1) {
      this.type = "application/json"
      this.status = 201
      this.body = JSON.stringify({ message: "Success!" })
    } else {
      this.status = 400
    }
  } else {
    delete valid.digest
    this.type = "application/json"
    this.status = 400
    this.body = JSON.stringify(valid)
  }

}

export default function (router) {
  return function *(next) {
    router.put("/signup/:id", create)

    yield next
  }
}
