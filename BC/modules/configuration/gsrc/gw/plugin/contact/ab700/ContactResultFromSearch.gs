package gw.plugin.contact.ab700

uses gw.plugin.Plugins
uses gw.plugin.contact.ContactResult
uses gw.plugin.contact.impl.AbstractContactResultExternal
uses gw.plugin.phone.IPhoneNormalizerPlugin
uses wsi.remote.gw.webservice.ab.ab700.abcontactapi.types.complex.ABContactAPISearchResult

uses java.lang.Double
uses java.util.Date

/**
 * Generic Implementation of the ContactResult interface.  The only existing constructor
 * takes an ABContactAPISearchResult as an argument, but additional constructors that
 * populate the internal fields can be created as necessary.
 * @deprecated (Since 8.0.0) Please use the ab800 package.
 */
@java.lang.Deprecated
@Export
class ContactResultFromSearch extends AbstractContactResultExternal implements ContactResult {

  private var _cellPhone : String as readonly CellPhone
  private var _cellPhoneCountry : PhoneCountryCode as readonly CellPhoneCountry
  private var _cellPhoneExtension : String as readonly CellPhoneExtension
  private var _companyName : String as readonly CompanyName
  private var _companyNameKanji : String as readonly CompanyNameKanji
  private var _abUID : String as readonly ContactAddressBookUID
  private var _contactType : typekey.Contact as readonly ContactType
  private var _dob : Date as readonly DateOfBirth
  private var _email1 : String as readonly EmailAddress1
  private var _email2 : String as readonly EmailAddress2
  private var _faxPhone : String as readonly FaxPhone
  private var _faxPhoneCountry : PhoneCountryCode as readonly FaxPhoneCountry
  private var _faxPhoneExtension : String as readonly FaxPhoneExtension
  private var _firstName : String as readonly FirstName
  private var _firstNameKanji : String as readonly FirstNameKanji
  private var _homePhone : String as readonly HomePhone
  private var _homePhoneCountry : PhoneCountryCode as readonly HomePhoneCountry
  private var _homePhoneExtension : String as readonly HomePhoneExtension
  private var _particle : String as readonly Particle
  private var _lastName : String as readonly LastName
  private var _lastNameKanji : String as readonly LastNameKanji
  private var _middleName : String as readonly MiddleName
  private var _preferred : Boolean as readonly PreferredVendor
  private var _prefix : NamePrefix as readonly Prefix
  private var _city : String as readonly PrimaryAddressCity
  private var _cityKanji : String as readonly PrimaryAddressCityKanji
  private var _country : Country as readonly PrimaryAddressCountry
  private var _county : String as readonly PrimaryAddressCounty
  private var _desc : String as readonly PrimaryAddressDescription
  private var _line1 : String as readonly PrimaryAddressLine1
  private var _line1Kanji : String as readonly PrimaryAddressLine1Kanji
  private var _line2 : String as readonly PrimaryAddressLine2
  private var _line2Kanji : String as readonly PrimaryAddressLine2Kanji
  private var _line3 : String as readonly PrimaryAddressLine3
  private var _postalCode : String as readonly PrimaryAddressPostalCode
  private var _CEDEX : Boolean as readonly PrimaryAddressCEDEX
  private var _CEDEXBureau : String as readonly PrimaryAddressCEDEXBureau
  private var _state : State as readonly PrimaryAddressState
  private var _addressType : AddressType as readonly PrimaryAddressType
  private var _valUntil : Date as readonly PrimaryAddressValidUntil
  private var _phoneType : PrimaryPhoneType as readonly PrimaryPhoneType
  private var _score : Number as readonly Score
  private var _suffix : NameSuffix as readonly Suffix
  private var _taxID : String as readonly TaxID
  private var _vendorType : VendorType as readonly VendorType
  private var _workPhone : String as readonly WorkPhone
  private var _workPhoneCountry : PhoneCountryCode as readonly WorkPhoneCountry
  private var _workPhoneExtension : String as readonly WorkPhoneExtension

  var normalizer = Plugins.get(IPhoneNormalizerPlugin)

  construct(rawResult : ABContactAPISearchResult) {
    _contactType = translateContactType(rawResult.ContactType)
    var aCellPhone = normalizer.parsePhoneNumber(rawResult.CellPhone)
    _cellPhone = aCellPhone.NationalNumber
    _cellPhoneCountry = aCellPhone.CountryCode
    _cellPhoneExtension = aCellPhone.Extension
    _companyName = rawResult.Name
    _abUID = rawResult.LinkID
    _dob = rawResult.DateOfBirth
    _email1 = rawResult.EmailAddress1
    _email2 = rawResult.EmailAddress2
    var aFaxPhone = normalizer.parsePhoneNumber(rawResult.FaxPhone)
    _faxPhone = aFaxPhone.NationalNumber
    _faxPhoneCountry = aFaxPhone.CountryCode
    _faxPhoneExtension = aFaxPhone.Extension
    _firstName = rawResult.FirstName
    var aHomePhone = normalizer.parsePhoneNumber(rawResult.HomePhone)
    _homePhone = aHomePhone.NationalNumber
    _homePhoneCountry = aHomePhone.CountryCode
    _homePhoneExtension = aHomePhone.Extension
    _lastName = rawResult.LastName
    _middleName = rawResult.MiddleName
    _preferred = rawResult.Preferred
    _prefix = rawResult.Prefix
    _city = rawResult.PrimaryAddress.City
    _country = rawResult.PrimaryAddress.Country
    _county = rawResult.PrimaryAddress.County
    _desc = rawResult.PrimaryAddress.Description
    _line1 = rawResult.PrimaryAddress.AddressLine1
    _line2 = rawResult.PrimaryAddress.AddressLine2
    _line3 = rawResult.PrimaryAddress.AddressLine3
    _postalCode = rawResult.PrimaryAddress.PostalCode
    _state = rawResult.PrimaryAddress.State
    _addressType = rawResult.PrimaryAddress.AddressType
    _valUntil = rawResult.PrimaryAddress.ValidUntil
    _phoneType = rawResult.PrimaryPhone
    _score = rawResult.Score
    _suffix = rawResult.Suffix
    _taxID = rawResult.TaxID
    _vendorType = rawResult.VendorType
    var aWorkPhone = normalizer.parsePhoneNumber(rawResult.WorkPhone)
    _workPhone = aWorkPhone.NationalNumber
    _workPhoneCountry = aWorkPhone.CountryCode
    _workPhoneExtension = aWorkPhone.Extension
  }
}
