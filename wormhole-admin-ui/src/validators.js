/* Reusable validator functions used in controls definitions
 *
 * validator functions receive the v and the configuration of the control
 * as arguments and return something that evals to false if v is valid,
 * and an error message if not valid.
 * */

export function isEmpty (v) {
  if (
    v === null ||
    v === undefined ||
    v === '' ||
      (Array.isArray(v) && v.length === 0)
  ) return true
  return false
}
