// Any type keywords
boolean-schema-message = A value is not allowed here
type-message = Expected a {$expectedTypes}
const-message = Expected {$expected}
enum-message = Expected {$expected}
format-message = Expected a value matching the '{$format}' format
unknown-message = Failed the '{$keyword}' keyword

// Number keywords
exclusiveMaximum-message = Expected a number less than {$exclusiveMaximum}
exclusiveMinimum-message = Expected a number greater than {$exclusiveMinimum}
maximum-message = Expected a number less than {$maximum}
minimum-message = Expected a number greater than {$minimum}
multipleOf-message = Expected a number that is a multiple of {$multipleOf}

// String keywords
maxLength-message = Expected a string with at most {$maxLength} characters
minLength-message = Expected a string with at least {$minLength} characters
pattern-message = Expected a string matching the regular expression /{$pattern}/

// Array keywords
maxItems-message = Expected an array with at most {$maxItems} items
minItems-message = Expected an array with at least {$minItems} items
contains-message = Expected an array that contains {$minContains ->
  [1] at least one item that passes
 *[other] at least {$minContains} items that pass
} the 'contains' schema
contains-range-message = Expected an array that contains between {$minContains} and {$maxContains} items that pass the 'contains' schema
contains-exact-message = Expected an array that contains {$minContains ->
  [1] one item that passes
 *[other] {$minContains} items that pass
} the 'contains' schema
uniqueItems-message = Duplicated item

// Object keywords
maxProperties-message = Expected an object with at most {$maxProperties} properties
minProperties-message = Expected an object with at least {$minProperties} properties
required-message = Required {$count ->
  [one] property {$required} is
 *[other] properties {$required} are
} missing

// Applicators
anyOf-message = Expected none of the alternatives match
oneOf-message = {$matchCount ->
  [0] None
  *[other] More than one
} of the alternatives match
not-message = Expected a value that doesn't match the 'not' schema
