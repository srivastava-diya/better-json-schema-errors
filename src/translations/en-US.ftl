boolean-schema-error = A value is not allowed here
type-error = Expected a {$expectedTypes}
const-error = Expected {$expected}
enum-error = Expected {$expected}
exclusiveMaximum-error = Expected a number less than {$exclusiveMaximum}
exclusiveMinimum-error = Expected a number greater than {$exclusiveMinimum}
maximum-error = Expected a number less than {$maximum}
minimum-error = Expected a number greater than {$minimum}
multipleOf-error = Expected a number that is a multiple of {$multipleOf}
maxLength-error = Expected a string with at most {$maxLength} characters
minLength-error = Expected a string with at least {$minLength} characters
maxItems-error = Expected an array with at most {$maxItems} items
format-error = Expected a value matching the '{$format}' format
required-error = Required {$count ->
  [one] property {$required} is
 *[other] properties {$required} are
} missing
