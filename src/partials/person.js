/**
 * Class representing simple employee.
 */
export class Person {
  /**
   * Create a person.
   * @param {Number} id - Person identifier.
   * @param {String} firstName - Person first name.
   * @param {String} lastName - Person last name.
   */
  constructor({
    id,
    firstName,
    lastName,
  }) {
    /** @private @readonly @const {Number} */
    this.id_ = id

    /** @private {String} */
    this.firstName_ = firstName

    /** @private {String} */
    this.lastName_ = lastName
  }

  /**
   * Get person identifier.
   * @return {Number} Person identifier.
   */
  getId() {
    return this.id_
  }

  /**
   * Get person first name.
   * @return {String} Person first name.
   */
  getFirstName() {
    return this.firstName_
  }

  /**
   * Set person first name.
   * @param {String} firstName - The new one person first name.
   */
  setFirstName(firstName = '') {
    const trimmedFirstName = firstName.trim()
    if (trimmedFirstName !== '') {
      this.firstName_ = trimmedFirstName
    } else {
      throw new Error('Person first name cannot be empty')
    }
  }

  /**
   * Get person last name.
   * @return {String} Person last name.
   */
  getLastName() {
    return this.lastName_
  }

  /**
   * Set person last name.
   * @param {String} lastName - The new one person last name.
   */
  setLastName(lastName = '') {
    const trimmedLastName = lastName.trim()
    if (trimmedLastName !== '') {
      this.lastName_ = trimmedLastName
    } else {
      throw new Error('Person last name cannot be empty')
    }
  }

  /**
   * Produce a person from raw server response data (factory method).
   * @param {Object} rawPerson - Raw (not validated) server response person data
   * @return {Person}
   */
  static producePerson(rawPerson) {
    if (rawPerson.id === null || rawPerson.id === undefined) {
      throw new Error('Bad person data: no data')
    }
    if (rawPerson.firstName === null || rawPerson.firstName === undefined) {
      throw new Error('Bad person data: no first name')
    }
    if (rawPerson.lastName === null || rawPerson.lastName === undefined) {
      throw new Error('Bad person data: no last name')
    }
    return new this(rawPerson)
  }
}

/**
 * Class representing list of related Person class instances and encapsulating
 * business logic for processing the list.
 */
export class PersonsList {
  /**
   * Create a PersonsList.
   * @param {Array.<Person>} persons - Array of Person class instances.
   */
  constructor(persons = []) {
    /** @private {Array.<Person>} */
    this.persons_ = persons

    /** @private {Number} */
    this.index_ = 0
  }

  /**
   * Produce a persons list from raw server response data (factory method).
   * @param {{id: Number, firstName: String, lastName: String}[]} rawPersons
   * - Array of person data objects.
   * @return {PersonsList}
   */
  static producePersonsList(rawPersons) {
    const persons = []
    for (const personData of rawPersons) {
      try {
        persons.push(Person.producePerson(personData))
      } catch (err) {
        throw new Error('Defective Person cannot be added to the PersonsList')
      }
    }
    return new this(persons)
  }
}
