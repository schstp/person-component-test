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
   * Get person full name.
   * @return {String} Person full name.
   */
  getFullName() {
    return this.firstName_ + ' ' + this.lastName_
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
    if (rawPerson.firstName === null ||
      rawPerson.firstName === undefined ||
      rawPerson.firstName === '') {
      rawPerson.firstName = 'Не указано'
    }
    if (rawPerson.lastName === null ||
      rawPerson.lastName === undefined ||
      rawPerson.lastName === '') {
      rawPerson.lastName = 'Не указано'
    }
    return new this(rawPerson)
  }
}

/**
 * Class representing collection of related Person class instances
 * and encapsulating business logic for processing the collection.
 */
export class PersonsCollection {
  /** @private @const Collection update error message */
  static updateErrMsg_ =
    'Defective Person cannot be added to the PersonsCollection'

  /**
   * Create a PersonsCollection.
   * @param {Array.<Person>} persons - Array of Person class instances.
   */
  constructor(persons = []) {
    /** @private {Array.<Person>} */
    this.persons_ = persons

    /** @private @readonly {Number} */
    this.length_ = persons.length
  }

  /**
   * Push person to the list.
   * @param {Person|{id: Number, firstName: String, lastName: String}} person
   * - The new one person to add.
   */
  push(person) {
    if (person instanceof Person) {
      this.persons_.push(person)
    } else {
      try {
        this.persons_.push(Person.producePerson(person))
      } catch (err) {
        throw new Error(PersonsCollection.updateErrMsg_)
      }
    }
    this.length_++
  }

  /**
   * Get person with specified id from the collection.
   * @param {Number} id - The id of person to get.
   * @return {Person|undefined} Person class instance or undefined if not found.
   */
  getPersonById(id) {
    return this.persons_.find((person) => {
      return person.getId() === id
    })
  }

  /**
   * Get person at specified position from the collection.
   * @param {Number} index - The index of person to get.
   * @return {Person|undefined} Person class instance or undefined if not found.
   */
  getPersonAt(index) {
    return this.persons_[index]
  }

  /**
   * Remove person with specified id from the collection.
   * @param {Number} id - The id of person to delete.
   * @return {Boolean} The sign of operation success.
   */
  removePersonById(id) {
    const index = this.persons_.findIndex((person) => {
      return person.getId() === id
    })
    if (index > -1) {
      this.persons_.splice(index, 1)
      this.length_--
      return true
    }
    return false
  }

  /**
   * Get persons collection length.
   * @return {Number}
   */
  getLength() {
    return this.length_
  }

  /**
   * Produce a persons collection from
   * raw server response data (factory method).
   * @param {{id: Number, firstName: String, lastName: String}[]} rawPersons
   * - Array of person data objects.
   * @return {PersonsCollection}
   */
  static producePersonsCollection(rawPersons) {
    const persons = []
    for (const personData of rawPersons) {
      try {
        persons.push(Person.producePerson(personData))
      } catch (err) {
        const error = Error(PersonsCollection.updateErrMsg_)
        console.warn(err)
        console.warn(error)
      }
    }
    return new this(persons)
  }

  /**
   * Iterate over persons array.
   * @return {PersonsCollectionIterator} Iterator
   */
  [Symbol.iterator]() {
    return new PersonsCollectionIterator(this)
  }
}

/**
 * Class representing Iterator over PersonsCollection instance.
 */
class PersonsCollectionIterator {
  /**
   * Create a PersonsCollectionIterator
   * @param {PersonsCollection} personsCollection - PersonsCollection instance
   */
  constructor(personsCollection) {
    /** @private {PersonsCollection} Iteration object*/
    this.personsCollection_ = personsCollection

    /** @private {Number} Next value index*/
    this.index_ = 0
  }

  /**
   * Get next elem from the persons collection.
   * @return {{value: Person, done: boolean}|{done: boolean}}
   */
  next() {
    if (this.index_ === this.personsCollection_.getLength()) {
      return { done: true }
    }

    const result = {
      value: this.personsCollection_.getPersonAt(this.index_),
      done: false,
    }

    this.index_++

    return result
  }
}
