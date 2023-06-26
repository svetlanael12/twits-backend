const successJson = (body) => {
  return { status: 'success', body: body }
}

const errorJson = (field, message) => {
  return { status: 'error', field, message }
}

module.exports = {
  successJson,
  errorJson
}