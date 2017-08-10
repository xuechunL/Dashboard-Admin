import axios from 'axios'

// online
const BASE_URL = '/ether/api/v1'
// local
// const BASE_URL = 'http://localhost:3000/ether/api/v1'

/**
 * [fetchData description]
 * @param  {[String]} fetchUrl
 * @return {[Promise]}
 */
export const fetchData = (fetchUrl) => {
  const promise = new Promise(function (resolve, reject) {
    axios({
      method: 'get',
      url: BASE_URL + fetchUrl,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    }).then(function (res) {
      if (res.status === 200)
        resolve(res.data)
      else
        reject(new Error(res))
    })
  })
  return promise
}

/**
 * [postData description]
 * @param  {[String]} postUrl, {Object} json
 * @return {[Promise]}
 */
export const postData = (postUrl, json) => {
  const promise = new Promise(function (resolve, reject) {
    axios({
      method: 'post',
      url: BASE_URL + postUrl,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: JSON.stringify(json)
    }).then(function (res) {
      if (res.status === 200)
        resolve()
      else
        reject(new Error(res))
    })
  })
  return promise
}

/**
 * [putData description]
 * @param  {[String]} putUrl, {Object} json
 * @return {[Promise]}
 */
export const putData = (putUrl, json) => {
  const promise = new Promise(function (resolve, reject) {
    axios({
      method: 'put',
      url: BASE_URL + putUrl,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: JSON.stringify(json)
    }).then(function (res) {
      if (res.status === 200)
        resolve()
      else
        reject(new Error(res))
    })
  })
  return promise
}
