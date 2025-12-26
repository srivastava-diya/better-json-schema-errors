import { addErrorHandler, setNormalizationHandler } from "./json-schema-errors.js";

// Normalization Handlers
import constNormalizationHandler from "./normalization-handlers/const.js";
import definitionsNormalizationHandler from "./normalization-handlers/definitions.js";
import dependentRequiredNormalizationHandler from "./normalization-handlers/dependentRequired.js";
import enumNormalizationHandler from "./normalization-handlers/enum.js";
import exclusiveMaximumNormalizationHandler from "./normalization-handlers/exclusiveMaximum.js";
import exclusiveMinimumNormalizationHandler from "./normalization-handlers/exclusiveMinimum.js";
import formatNormalizationHandler from "./normalization-handlers/format.js";
import maximumNormalizationHandler from "./normalization-handlers/maximum.js";
import maxLengthNormalizationHandler from "./normalization-handlers/maxLength.js";
import minimumNormalizationHandler from "./normalization-handlers/minimum.js";
import minLengthNormalizationHandler from "./normalization-handlers/minLength.js";
import multipleOfNormalizationHandler from "./normalization-handlers/multipleOf.js";
import propertiesNormalizationHandler from "./normalization-handlers/properties.js";
import refNormalizationHandler from "./normalization-handlers/ref.js";
import requiredNormalizationHandler from "./normalization-handlers/required.js";
import typeNormalizationHandler from "./normalization-handlers/type.js";

// Error Handlers
import booleanSchemaErrorHandler from "./error-handlers/boolean-schema.js";
import constErrorHandler from "./error-handlers/const.js";
import dependentRequiredErrorHandler from "./error-handlers/dependentRequired.js";
import enumErrorHandler from "./error-handlers/enum.js";
import exclusiveMaximumErrorHandler from "./error-handlers/exclusiveMaximum.js";
import exclusiveMinimumErrorHandler from "./error-handlers/exclusiveMinimum.js";
import formatErrorHandler from "./error-handlers/format.js";
import maximumErrorHandler from "./error-handlers/maximum.js";
import maxLengthErrorHandler from "./error-handlers/maxLength.js";
import minimumErrorHandler from "./error-handlers/minimum.js";
import minLengthErrorHandler from "./error-handlers/minLength.js";
import multipleOfErrorHandler from "./error-handlers/multipleOf.js";
import requiredErrorHandler from "./error-handlers/required.js";
import typeErrorHandler from "./error-handlers/type.js";

setNormalizationHandler("https://json-schema.org/keyword/const", constNormalizationHandler);
setNormalizationHandler("https://json-schema.org/keyword/definitions", definitionsNormalizationHandler);
setNormalizationHandler("https://json-schema.org/keyword/dependentRequired", dependentRequiredNormalizationHandler);
setNormalizationHandler("https://json-schema.org/keyword/enum", enumNormalizationHandler);
setNormalizationHandler("https://json-schema.org/keyword/draft-2020-12/format", formatNormalizationHandler);
setNormalizationHandler("https://json-schema.org/keyword/draft-2020-12/format-assertion", formatNormalizationHandler);
setNormalizationHandler("https://json-schema.org/keyword/draft-2019-09/format", formatNormalizationHandler);
setNormalizationHandler("https://json-schema.org/keyword/draft-2019-09/format-assertion", formatNormalizationHandler);
setNormalizationHandler("https://json-schema.org/keyword/draft-07/format", formatNormalizationHandler);
setNormalizationHandler("https://json-schema.org/keyword/draft-06/format", formatNormalizationHandler);
setNormalizationHandler("https://json-schema.org/keyword/draft-04/format", formatNormalizationHandler);
setNormalizationHandler("https://json-schema.org/keyword/exclusiveMaximum", exclusiveMaximumNormalizationHandler);
setNormalizationHandler("https://json-schema.org/keyword/exclusiveMinimum", exclusiveMinimumNormalizationHandler);
setNormalizationHandler("https://json-schema.org/keyword/maximum", maximumNormalizationHandler);
setNormalizationHandler("https://json-schema.org/keyword/maxLength", maxLengthNormalizationHandler);
setNormalizationHandler("https://json-schema.org/keyword/minimum", minimumNormalizationHandler);
setNormalizationHandler("https://json-schema.org/keyword/minLength", minLengthNormalizationHandler);
setNormalizationHandler("https://json-schema.org/keyword/multipleOf", multipleOfNormalizationHandler);
setNormalizationHandler("https://json-schema.org/keyword/properties", propertiesNormalizationHandler);
setNormalizationHandler("https://json-schema.org/keyword/ref", refNormalizationHandler);
setNormalizationHandler("https://json-schema.org/keyword/required", requiredNormalizationHandler);
setNormalizationHandler("https://json-schema.org/keyword/type", typeNormalizationHandler);

addErrorHandler(booleanSchemaErrorHandler);
addErrorHandler(constErrorHandler);
addErrorHandler(dependentRequiredErrorHandler);
addErrorHandler(enumErrorHandler);
addErrorHandler(exclusiveMaximumErrorHandler);
addErrorHandler(exclusiveMinimumErrorHandler);
addErrorHandler(formatErrorHandler);
addErrorHandler(maximumErrorHandler);
addErrorHandler(maxLengthErrorHandler);
addErrorHandler(minimumErrorHandler);
addErrorHandler(minLengthErrorHandler);
addErrorHandler(multipleOfErrorHandler);
addErrorHandler(requiredErrorHandler);
addErrorHandler(typeErrorHandler);

export { addErrorHandler, jsonSchemaErrors, setNormalizationHandler } from "./json-schema-errors.js";
