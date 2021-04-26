// import { body, check } from 'express-validator/check';
// import { sanitizeBody, sanitize } from 'express-validator/filter';

const { body, check } = require('express-validator/check');
const { sanitizeBody, sanitize } = require('express-validator/filter');

class InputValidator {
  static signUpValidator() {
    return [
      sanitizeBody(['password', 'name', 'email']).trim(),
      body('name')
        .exists()
        .withMessage('name is required')
        .isLength({ min: 3 })
        .withMessage('Minimum length is 3')
        .not()
        .matches(/\d/g)
        .withMessage('Name cannot contain numbers'),
      ...InputValidator.loginValidator()
    ];
  }

  static loginValidator() {
    return [
      ...InputValidator.emailValidation(),
      ...InputValidator.passwordValidation()
    ];
  }

  static emailValidation() {
    return [
      body('email')
        .isEmail()
        .withMessage('A valid email is required')
    ];
  }

  static passwordValidation() {
    return [
      body('password')
        .exists()
        .withMessage('password is required')
        .isLength({ min: 5 })
        .withMessage('Minimum length is 5')
        .not()
        .matches(/\s/g)
        .withMessage('Spaces are not allowed')
    ];
  }

  static optionalPasswordValidation() {
    return [
      body('password')
        .optional()
        .isLength({ min: 5 })
        .withMessage('Minimum length is 5')
        .not()
        .matches(/\s/g)
        .withMessage('Spaces are not allowed')
    ];
  }

  static phoneNumberValidation(field) {
    return [
      body(field)
        .optional({nullable:true})
        .isMobilePhone()
        .withMessage('Enter a valid phone number')
    ];
  }

  static customerDetailsValidator() {
    const fields = [
      'password',
      'name',
      'email',
      'day_phone',
      'eve_phone',
      'mob_phone'
    ];

    return [
      sanitizeBody(fields).trim(),
      ...InputValidator.emailValidation(),
      ...InputValidator.optionalPasswordValidation(),
      ...InputValidator.phoneNumberValidation('day_phone'),
      ...InputValidator.phoneNumberValidation('eve_phone'),
      ...InputValidator.phoneNumberValidation('mob_phone')
    ];
  }

  static creditCardValidator() {
    return [
      sanitizeBody(['credit_card']).trim(),
      body('credit_card')
        .isCreditCard()
        .withMessage('valid credit_card number is required')
    ];
  }

  static checkoutValidator() {
    if(body('payments').contains('cash')){
      return [
        sanitizeBody(['shipping_address_id', 'billing_address_id']).trim(),
        ...InputValidator.integerValidator('shipping_address_id'),
        ...InputValidator.integerValidator('billing_address_id'),
      ];
    } else{
      return [
        sanitizeBody(['card_number', 'cvv', 'exp_date_m', 'exp_date_y', 'shipping_address_id', 'billing_address_id']).trim(),
        body('card_number')
          .isCreditCard()
          .withMessage('valid credit_card number is required'),
        body('cvv')
          .isInt({ min: 100, max: 999}),
        body('exp_date_m')
          .isInt({ min: 1, max: 12}),
        body('exp_date_m')
          .isInt({ min: 0, max: 99}),
        ...InputValidator.integerValidator('shipping_address_id'),
        ...InputValidator.integerValidator('billing_address_id'),
        
      ];
    }
  }

  static stringValidator(field) {
    return [
      body(field)
        .isAscii()
        .withMessage('Enter a valid string')
    ];
  }

  static optionalStringValidator(field) {
    return [
      body(field)
        .optional()
        .isAscii()
        .withMessage('Enter a valid string')
    ];
  }

  static integerValidator(field) {
    return [
      sanitize(field).trim(),
      check(field)
        .isInt({ min: 1 })
        .withMessage(`Enter a valid ${field} number`),
      sanitize(field).toInt()
    ];
  }

  static addressValidator() {
    const requiredStringFields = ['address_1', 'city', 
    // 'region', 
    // 'postal_code', 
    'country'];
    const validations = requiredStringFields.flatMap(item => InputValidator.stringValidator(item));
    return [
      sanitizeBody([...requiredStringFields, 'address_2']).trim(),
      ...validations,
      ...InputValidator.optionalStringValidator('address_2'),
      // ...InputValidator.integerValidator('shipping_region_id')
    ];
  }

  static addressIdValidator() {
    return [
      sanitizeBody(['address_id']).trim(),
      ...InputValidator.integerValidator('address_id'),
    ];
  }

  static cartValidator() {
    // return [
    //   sanitizeBody(['size', 'color', 'product_id']).trim(),
    //   ...InputValidator.stringValidator('size'),
    //   ...InputValidator.stringValidator('color'),
    //   ...InputValidator.integerValidator('product_id'),
    // ];
    return [
      sanitizeBody(['quantity', 'product_id']).trim(),
      ...InputValidator.integerValidator('product_id'),
      ...InputValidator.integerValidator('quantity'),
    ];
  }

  static stripeValidator() {
    return [
      sanitizeBody(['stripeToken', 'order_id']).trim(),
      ...InputValidator.stringValidator('stripeToken'),
      ...InputValidator.integerValidator('order_id')
    ];
  }

  static cartItemValidator(){
    return [
      sanitizeBody(['item_id']).trim(),
      ...InputValidator.integerValidator('item_id'),
    ];
  }

  static reviewValidator(){
    return[
      sanitizeBody('review', 'rating').trim(),
      ...InputValidator.integerValidator('rating'),
      ...InputValidator.stringValidator('review')
    ]
  }

}

module.exports = InputValidator;
